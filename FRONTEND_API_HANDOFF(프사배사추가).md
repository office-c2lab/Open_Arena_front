# ARENA 프론트엔드 API 연동 명세

## 1. 문서 목적

이 문서는 `http://13.124.55.115/`에 배포된 프론트엔드 목업 화면을 실제
ARENA OPEN 백엔드 API에 연결하기 위한 인수인계 문서다. 프론트엔드 라우트별로
호출할 API와 호출 시점을 정리하고, 로그인 쿠키·CSRF·비동기 작업 처리 규칙을
정의한다.

- API prefix: `/api/v1`
- 백엔드 Swagger: `http://3.34.62.133/docs`
- 백엔드 OpenAPI JSON: `http://3.34.62.133/openapi.json`
- 전달용 OpenAPI 파일: [`openapi/arena-openapi.json`](openapi/arena-openapi.json)
- 현재 Swagger와 OpenAPI는 허용된 관리 IP에서만 접근할 수 있다.
- 학습 자료(`/education`)는 프론트엔드 정적 데이터로 관리하므로 API 연동 범위에서 제외한다.

## 2. 반드시 먼저 적용할 공통 규칙

### 2.1 API 주소

프론트엔드 코드는 백엔드 IP를 직접 호출하지 않고 같은 origin의 상대 경로를 사용한다.

```ts
const API_PREFIX = "/api/v1";
```

프론트엔드 Nginx가 `/api/` 요청을 백엔드로 reverse proxy해야 한다. 브라우저가
`http://3.34.62.133`을 직접 호출하면 로그인 쿠키와 CSRF를 정상적으로 사용할 수
없다.

프론트엔드 서버 Nginx 설정 예시는 다음과 같다.

```nginx
location /api/ {
    proxy_pass http://3.34.62.133;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

현재 IP 기반 HTTP 개발 환경에서는 위 프록시를 적용하고 백엔드에 다음 값을 사용한다.

```env
ARENA_SESSION_COOKIE_SECURE=false
ARENA_SESSION_COOKIE_SAMESITE=lax
```

세션 쿠키의 `HttpOnly`, 모든 쿠키의 `Path=/`과 Domain 미지정 설정은 유지한다.
도메인과 HTTPS를 적용할 때 `ARENA_SESSION_COOKIE_SECURE=true`로 반드시 복구한다.

### 2.2 쿠키 기반 인증

사용자와 관리자는 JWT를 직접 저장하지 않는다. 로그인 성공 시 백엔드가 세션 쿠키와
CSRF 쿠키를 발급한다.

| 구분 | 세션 쿠키 | CSRF 쿠키 |
| --- | --- | --- |
| 일반 회원 | `arena_session` | `arena_csrf` |
| 관리자 | `arena_admin_session` | `arena_admin_csrf` |

HTTP 개발 환경에서도 세션 쿠키는 `HttpOnly=true`, CSRF 쿠키는 프론트가 읽을 수
있도록 `HttpOnly=false`를 사용한다.

모든 API 요청에 쿠키를 포함한다.

```ts
await fetch(`${API_PREFIX}/account/me`, {
  credentials: "include",
});
```

### 2.3 CSRF 처리

`POST`, `PUT`, `PATCH`, `DELETE` 중 로그인 이후 상태를 변경하는 API는 CSRF
헤더가 필요하다. 일반 회원 요청은 `arena_csrf`, 관리자 요청은
`arena_admin_csrf` 쿠키 값을 읽어 `X-CSRF-Token` 헤더에 그대로 넣는다.

```ts
await fetch(`${API_PREFIX}/account/nickname`, {
  method: "PATCH",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": readCookie("arena_csrf"),
  },
  body: JSON.stringify({ nickname: "새닉네임" }),
});
```

로그인, 회원가입, 인증번호 발급·확인, 비밀번호 재설정 요청·완료에는 CSRF 헤더가
필요하지 않다. Swagger에서 `X-CSRF-Token` 파라미터가 표시되는 API를 기준으로
처리한다.

### 2.4 공통 응답 처리

- `204 No Content`: 응답 body를 JSON으로 파싱하지 않는다.
- `401 Unauthorized`: 로그인 상태를 비우고 로그인 화면으로 이동한다.
- `403 Forbidden`: 권한 또는 CSRF 오류 메시지를 표시한다.
- `404 Not Found`: 삭제되었거나 비공개인 문제·공지로 처리한다.
- `409 Conflict`: 중복 가입, 중복 제출, 변경 제한 등 충돌 메시지를 표시한다.
- `422 Unprocessable Entity`: 입력 필드 검증 오류를 각 필드에 표시한다.
- `429 Too Many Requests`: 인증번호 재발송 또는 로그인 요청 제한 시간을 안내한다.

업무 오류의 기본 형태는 다음과 같다.

```json
{
  "detail": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 메시지"
  }
}
```

FastAPI 입력 검증 오류(`422`)는 `detail` 배열 형태일 수 있으므로 두 형태를 모두
처리한다.

### 2.5 멱등성 키

채팅 전송과 Judge 제출에는 요청마다 새 UUID를 생성해 `Idempotency-Key` 헤더로
보낸다. 사용자가 같은 버튼을 연속 클릭해도 동일 동작에는 같은 키를 재사용한다.

```ts
headers: {
  "Idempotency-Key": crypto.randomUUID(),
  "X-CSRF-Token": readCookie("arena_csrf"),
}
```

## 3. 목업 화면별 API 매핑

### 3.1 공통 헤더·홈 `/`, `/dashboard`

| 화면 요소 | API | 호출 시점 | 사용 필드·처리 |
| --- | --- | --- | --- |
| 로그인 상태 확인 | `GET /account/me` | 앱 최초 진입 | `email`, `nickname`, `membership` |
| 홈 요약 전체 | `GET /dashboard` | 로그인 홈 진입 | 계정, 오늘 사용량, 점수, 해결 수, 순위, 카테고리 진행률, 최근 공지 |
| 공지 목록 더보기 | `GET /notices?offset=0&limit=20` | 공지 더보기 | 공개·게시 시각이 된 공지만 반환 |
| 공지 상세 | `GET /notices/{notice_id}` | 공지 클릭 | 제목, 본문, 게시 시각 |
| 로그아웃 | `POST /auth/logout` | 로그아웃 클릭 | 일반 회원 CSRF 필요, 성공 `204` |

홈에서는 여러 API를 따로 조합하기보다 `GET /dashboard`를 우선 사용한다.

### 3.2 로그인 `/login`

| 동작 | API | 비고 |
| --- | --- | --- |
| 로그인 | `POST /auth/login` | 성공 `204`, 세션·CSRF 쿠키 발급 |
| 로그인 직후 사용자 조회 | `GET /account/me` | 전역 사용자 상태 저장 |
| 자동 로그인 | 로그인 body의 `remember_me: true` | 체크하지 않으면 브라우저 세션 쿠키 |
| 비밀번호 찾기 | `POST /auth/password-reset-requests` | 가입 여부와 무관하게 동일 메시지 표시 |

```json
{
  "email": "member@example.com",
  "password": "Password1!",
  "remember_me": true
}
```

### 3.3 회원가입 `/signup`

회원가입 버튼은 이메일 인증 완료, 필수 약관 동의, 만 14세 이상 확인, 비밀번호
검증이 모두 끝났을 때 활성화한다.

1. `GET /auth/legal-documents`로 최신 약관을 조회한다.
2. `POST /auth/email-verifications`에 이메일을 보내 인증번호 발급을 요청한다.
3. 응답의 `challenge_id`와 `resend_available_at`을 화면 상태에 저장한다.
4. 사용자가 6자리 인증번호를 입력하면
   `POST /auth/email-verifications/{challenge_id}/confirm`을 호출한다.
5. 응답의 `verification_proof`를 메모리에 저장한다.
6. 가입 버튼 클릭 시 `POST /auth/register`를 호출한다.
7. 가입 성공 후 로그인 화면으로 이동한다. 가입 API는 로그인 쿠키를 발급하지 않는다.

인증번호 요청:

```json
{
  "email": "member@example.com"
}
```

인증번호 확인:

```json
{
  "code": "123456"
}
```

가입 요청:

```json
{
  "email": "member@example.com",
  "nickname": "아레나회원",
  "password": "Password1!",
  "password_confirm": "Password1!",
  "verification_challenge_id": "인증번호 요청에서 받은 UUID",
  "verification_proof": "인증번호 확인에서 받은 proof",
  "consent_document_ids": ["동의한 필수 약관 UUID"],
  "is_over_14": true
}
```

입력 정책:

- 닉네임: 2~8자, 한글·영문·숫자·밑줄만 허용
- 비밀번호: 8~128자, 영문·숫자·특수문자를 각각 1자 이상 포함
- 이메일 인증 proof는 새로고침 시 유지할 필요가 없으며 브라우저 저장소에 장기 저장하지 않는다.
- `consent_document_ids`에는 API가 반환한 `is_required: true` 문서의 ID를 모두 포함한다.

### 3.4 비밀번호 재설정

| 화면·동작 | API | 요청 값 |
| --- | --- | --- |
| 재설정 메일 요청 | `POST /auth/password-reset-requests` | `email` |
| 메일 링크 진입 후 변경 | `POST /auth/password-resets` | `reset_token_id`, `reset_token`, 새 비밀번호 2회 |

프론트엔드 재설정 URL은 메일 링크의 query parameter에서 `reset_token_id`와
`reset_token`을 읽어 완료 API로 전달해야 한다.

약관 화면 `/terms`, `/privacy`는 `GET /auth/legal-documents` 응답을
`document_type`으로 구분해 표시한다.

### 3.5 마이페이지 `/mypage`·계정 설정 `/settings`

| 화면 요소 | API | 비고 |
| --- | --- | --- |
| 계정 정보 | `GET /account/me` | 등급, 닉네임 변경 가능 시각 포함 |
| 오늘 무료 사용량 | `GET /account/usage/today` | 열람·제출·토큰의 `used`, `base_limit`, `additional_limit`, `effective_limit`, `remaining` 표시 |
| 챌린지 통계 | `GET /account/challenge-stats` | 성공 문제 수, 총 성공 횟수, 현재 순위 |
| 닉네임 변경 | `PATCH /account/nickname` | 일반 회원 CSRF 필요, 변경 후 7일 제한 |
| 프로필 사진 등록·변경 | `PUT /account/profile-image` | 유료 전용, `multipart/form-data`의 `image`, CSRF 필요 |
| 프로필 사진 삭제 | `DELETE /account/profile-image` | 유료 전용, CSRF 필요 |
| 배경 등록·변경 | `PUT /account/profile-background` | 유료 전용, `multipart/form-data`의 `image`, CSRF 필요 |
| 배경 삭제 | `DELETE /account/profile-background` | 유료 전용, CSRF 필요 |
| 비밀번호 변경 | `PATCH /account/password` | 현재 비밀번호와 새 비밀번호 2회 |
| 회원 탈퇴 | `POST /account/withdraw` | 비밀번호와 확인 문구, 성공 후 쿠키 제거 |

유료 회원은 사용량 응답의 `unlimited: true`를 기준으로 무제한 UI를 표시한다.
`GET /account/me`와 `GET /dashboard`의 `profile_image_url`,
`profile_background_url`을 이미지 주소로 사용한다. 값이 `null`이면 기본 이미지를
표시한다. 반환 URL은 상대 경로이며 조회에도 회원 세션 쿠키가 필요하다.

프로필 사진과 배경은 JPEG·PNG·WebP 최대 3 MiB다. 서버가 각각
512×512와 최대 1920×1080 WebP로 변환한다. 파일 input의 필드명은 `image`다.
무료 회원 요청은 `403 PAID_MEMBERSHIP_REQUIRED`, 잘못된 형식은
`400 UNSUPPORTED_MEDIA_TYPE` 또는 `400 INVALID_MEDIA_FILE`, 크기 초과는
`413 MEDIA_FILE_TOO_LARGE`로 처리한다. 유료에서 무료로 전환되면 두 URL은 즉시
`null`이 되고 기존 파일은 복구되지 않는다.

### 3.6 카테고리·문제 목록 `/kategorie`

| 화면 요소 | API | 비고 |
| --- | --- | --- |
| 전체 중지 확인 | `GET /challenges/status` | `enabled: false`면 중지 화면 표시 |
| 카테고리 탭·필터 | `GET /challenges/categories` | 비활성 카테고리는 반환하지 않음 |
| 문제 카드 목록 | `GET /challenges/problems` | 비활성·초안 문제는 반환하지 않음 |
| 찜한 문제 목록 | `GET /challenges/favorites` | 찜 보기 탭 |
| 찜 추가 | `PUT /challenges/problems/{problem_id}/favorite` | CSRF 필요, 성공 `204` |
| 찜 제거 | `DELETE /challenges/problems/{problem_id}/favorite` | CSRF 필요, 성공 `204` |

문제 카드는 `difficulty`, `max_score`, `attempt_status`, `solved`, `best_score`,
`successful_user_count`, `total_success_count`, `is_favorite`를 사용한다.

`attempt_status`는 다음 UI 상태로 표시한다.

- `not_started`: 미도전
- `in_progress`: 진행 중
- `failed`: 실패
- `success`: 해결

프론트 정렬은 난이도 순서를 `easy` → `normal` → `hard`로 적용하고, 같은 난이도
내 정렬은 API 반환 순서를 유지한다.

### 3.7 문제 상세 `/challenge/:problemId`

| 화면 요소 | API | 비고 |
| --- | --- | --- |
| 문제 상세 | `GET /challenges/problems/{problem_id}` | 잠금 상태에서도 공개 가능한 정보만 반환 |
| 무료 회원 문제 열기 | `POST /challenges/problems/{problem_id}/unlock` | CSRF 필요, 일일 열람 한도 차감 |
| 문제별 순위 | `GET /challenges/problems/{problem_id}/ranking?offset=0&limit=20` | 최소 성공 입력 토큰 기준 |
| 도전 시작 | `POST /chats/sessions` | 해금된 문제만 가능 |

상세 화면 최초 조회 후 `unlocked_today: false`인 무료 회원이 실제 문제 콘텐츠를
열려고 할 때만 `unlock`을 호출한다. 화면 진입만으로 열람 횟수를 차감하지 않는다.

채팅 세션 생성:

```json
{
  "problem_id": "문제 UUID",
  "title": "선택 입력 제목"
}
```

응답의 세션 `id`로 `/challenge/:problemId/play`에 진입한다.

### 3.8 문제 풀이 `/challenge/:problemId/play`

| 화면 요소 | API | 비고 |
| --- | --- | --- |
| 기존 세션 목록 | `GET /chats/sessions?problem_id={problem_id}&offset=0&limit=20` | 재진입·세션 선택 |
| 대화 내역 | `GET /chats/sessions/{session_id}/messages` | 메시지 렌더링 |
| 메시지 전송 | `POST /chats/sessions/{session_id}/messages` | CSRF와 `Idempotency-Key` 필요, 성공 `202` |
| 채팅 결과 확인 | `GET /chats/jobs/{job_id}` | 완료 전까지 polling |
| Judge 제출 | `POST /judge/sessions/{session_id}/submissions` | CSRF와 `Idempotency-Key` 필요, 성공 `202` |
| Judge 결과 확인 | `GET /judge/jobs/{job_id}` | 완료 전까지 polling |
| 제출 이력 | `GET /judge/submissions?problem_id={problem_id}&offset=0&limit=20` | 재도전 결과 표시 |
| 제출 상세 | `GET /judge/submissions/{submission_id}` | 마스킹된 판단 사유만 표시 |

메시지 전송 body:

```json
{
  "content": "사용자 입력"
}
```

채팅과 Judge는 `202 Accepted` 이후 비동기로 처리한다. 프론트엔드는 다음 방식으로
polling한다.

1. 응답의 `job_id`를 저장한다.
2. 1초 간격으로 해당 job 조회 API를 호출한다.
3. `pending` 또는 `running`이면 계속 대기한다.
4. `succeeded`가 되면 결과를 렌더링하고 메시지·제출 목록을 다시 조회한다.
5. `failed` 또는 `cancelled`이면 `error_code`를 사용자 메시지로 변환한다.
6. 화면을 벗어나거나 작업이 끝나면 polling을 중단한다.

Judge 요청 접수 후 30초가 지나기 전에는 같은 세션의 중복 제출 UI를 막는다.
판단 사유에는 이미 민감정보 마스킹이 적용되므로 프론트는 응답 문자열을 그대로 표시한다.

### 3.9 튜토리얼 `/tutorial`, `/tutorial/:tutorialId`

| 화면 요소 | API | 비고 |
| --- | --- | --- |
| 튜토리얼 문제 목록 | `GET /challenges/problems` | `is_tutorial: true`만 필터링 |
| 진행률 | `GET /challenges/tutorials/progress` | 완료·진행 상태 표시 |
| 상세·풀이 | 일반 문제 상세·채팅·Judge API | 동일한 흐름 사용 |

`/tutorial-preview/challenge-play`는 목업 확인용 라우트이므로 운영 메뉴에서 제거하거나
일반 튜토리얼 흐름으로 연결한다.

### 3.10 전체 순위 `/leaderboard`

| 화면 요소 | API | 비고 |
| --- | --- | --- |
| 전체 순위 | `GET /leaderboard?offset=0&limit=50` | 숨김 설정 시 API 응답에 따라 비공개 화면 표시 |
| 내 순위 | 같은 응답의 `current_user_rank` | 현재 페이지 밖이어도 표시 가능 |

전체 점수는 문제별 최고 점수의 합으로 계산된다. 같은 문제를 재도전해 더 적은 입력
토큰으로 성공하면 해당 기록이 문제별 순위와 최소 토큰 표시에 반영된다.

### 3.11 학습 자료 `/education`, `/education/:articleId`

백엔드 API를 호출하지 않는다. 목록, 상세 본문, 썸네일과 검색은 프론트엔드 정적
데이터로 구현한다.

## 4. 관리자 화면별 API 매핑

관리자 API는 일반 회원 세션과 분리된다. 관리자 화면은 일반 회원 로그인 여부와
무관하게 `GET /admin/account/me`로 관리자 세션을 확인한다.

### 4.1 관리자 로그인 `/admin/login`

| 동작 | API | 비고 |
| --- | --- | --- |
| 로그인 | `POST /admin/auth/login` | 성공 `204`, 관리자 전용 쿠키 발급 |
| 관리자 조회 | `GET /admin/account/me` | 로그인 성공 후 호출 |
| 로그아웃 | `POST /admin/auth/logout` | 관리자 CSRF 필요 |

```json
{
  "email": "admin@example.com",
  "password": "관리자 비밀번호"
}
```

### 4.2 관리자 홈 `/admin`

전용 통합 대시보드 API는 없다. 필요한 카드에 따라 아래 API를 병렬 호출한다.

| 화면 요소 | API |
| --- | --- |
| 회원 현황·목록 일부 | `GET /admin/users?offset=0&limit=20` |
| 문제 현황·목록 일부 | `GET /admin/problems?offset=0&limit=20` |
| 전체 순위 일부 | `GET /admin/leaderboard?offset=0&limit=20` |
| 최근 감사 로그 | `GET /admin/audit-logs?offset=0&limit=20` |
| 챌린지 전체 중지 상태 | `GET /admin/settings/challenge` |

관리자 홈의 정확한 카드 구성이 확정되면 별도 통합 API 추가 여부를 검토한다.

### 4.3 회원 관리 `/admin/users`, `/admin/user-management`

| 화면 요소·동작 | API | 비고 |
| --- | --- | --- |
| 검색·필터·목록 | `GET /admin/users` | `query`, `membership`, `account_status`, pagination |
| 오늘 사용량 | `GET /admin/users/{user_id}/usage/today` | 상세 또는 펼침 행 |
| 무료·유료 전환 | `PATCH /admin/users/{user_id}/membership` | 신청 없이 관리자 직접 변경 |
| 정상·정지 상태 변경 | `PATCH /admin/users/{user_id}/status` | 상태 변경 즉시 반영 |
| 전체 세션 해제 | `POST /admin/users/{user_id}/sessions/revoke` | 강제 로그아웃 |
| 재설정 메일 발송 | `POST /admin/users/{user_id}/password-reset-email` | 성공 `202` |
| 오늘 한도 추가 | `POST /admin/users/{user_id}/quota-adjustments` | 열람·제출·토큰을 차감 없이 추가 |
| 무료 회원 기본 한도 조회 | `GET /admin/settings/free-daily-limits` | 현재 설정 표시 |
| 무료 회원 기본 한도 변경 | `PUT /admin/settings/free-daily-limits` | 다음 날부터 적용 |

회원 목록 응답에는 점수, 해결 문제 수와 순위가 포함되어 있으므로
별도 통계 API를 호출하지 않는다.

### 4.4 문제 관리 `/admin/problems`

| 화면 요소·동작 | API |
| --- | --- |
| 문제 검색·목록 | `GET /admin/problems?query={검색어}&offset=0&limit=20` |
| 문제 상세 | `GET /admin/problems/{problem_id}` |
| 문제 생성 | `POST /admin/problems` |
| 문제 수정 | `PATCH /admin/problems/{problem_id}` |
| 문제 상태 변경 | `PATCH /admin/problems/{problem_id}/state` |
| 문제 완전 삭제 | `DELETE /admin/problems/{problem_id}` |
| 카테고리 목록·생성·수정·삭제 | `/admin/categories` API 묶음 |
| 채팅 모델 설정 | `/admin/chat-endpoints` API 묶음 |
| Judge 모델 설정 | `/admin/judge-endpoints` API 묶음 |
| 보호 문자열 목록·추가·삭제 | `/admin/problems/{problem_id}/protected-terms` API 묶음 |
| 전체 중지 조회·변경 | `GET`, `PUT /admin/settings/challenge` |

문제 생성·수정에는 콘텐츠 필드, 난이도, 배점, temperature, 채팅 endpoint,
시스템 프롬프트와 최대 3개 Judge endpoint 설정이 포함된다. 상세 요청 형식은
Swagger의 `ProblemCreateRequest`, `ProblemUpdateRequest`를 따른다.

문제를 비활성화하면 회원 화면에서 완전히 숨겨진다. 문제 삭제는 통계와 순위에서도
제외되는 완전 삭제이므로 확인 모달을 표시한다.

### 4.5 Judge 관리 `/admin/judge`

| 화면 요소·동작 | API |
| --- | --- |
| 제출 상세 조회 | `GET /admin/submissions/{submission_id}` |
| 수동 판정 변경 | `PATCH /admin/submissions/{submission_id}/verdict` |
| Judge endpoint 관리 | `/admin/judge-endpoints` API 묶음 |
| 문제별 보호 문자열 관리 | `/admin/problems/{problem_id}/protected-terms` API 묶음 |

관리자에게도 Judge 원문과 보호 문자열 원문은 제공하지 않는다. API가 반환하는
마스킹된 판단 사유만 표시한다.

### 4.6 관리자 채팅·판정 열람

| 화면 요소 | API |
| --- | --- |
| 세션 검색·필터 | `GET /admin/chat-sessions` |
| 세션 메시지 | `GET /admin/chat-sessions/{session_id}/messages` |
| 세션 제출 목록 | `GET /admin/chat-sessions/{session_id}/submissions` |

세션 목록은 `user_id`, `problem_id`, `submission_status`, `verdict` 필터를 지원한다.
열람 행위는 서버 감사 로그에 기록된다.

### 4.7 순위·풀이 현황 관리

| 화면 요소·동작 | API |
| --- | --- |
| 관리자 전체 순위 | `GET /admin/leaderboard` |
| 회원×문제 풀이 행렬 | `GET /admin/solve-matrix` |
| 회원 순위 공개 설정 | `GET /admin/settings/leaderboard` |
| 회원 순위 공개 변경 | `PUT /admin/settings/leaderboard` |

### 4.8 공지 관리

| 화면 요소·동작 | API |
| --- | --- |
| 검색·필터·목록 | `GET /admin/notices` |
| 상세 | `GET /admin/notices/{notice_id}` |
| 생성 | `POST /admin/notices` |
| 수정 | `PATCH /admin/notices/{notice_id}` |
| 삭제 | `DELETE /admin/notices/{notice_id}` |

예약 게시, 상단 고정과 상태 필드를 Swagger 스키마에 맞춰 전달한다.

### 4.9 감사 로그

`GET /admin/audit-logs`를 사용한다. `action`, `target_type`, `target_id`,
`actor_admin_id`와 pagination을 지원한다. 감사 로그는 조회 전용이다.

## 5. 프론트엔드 구현 우선순위

1. 공통 API client, 쿠키 포함, CSRF·오류 처리
2. 회원가입 이메일 인증 → 가입 → 로그인 → 세션 복원
3. 홈 대시보드와 계정 설정
4. 문제 목록 → 해금 → 상세 → 채팅 비동기 polling
5. Judge 제출 비동기 polling과 제출 이력
6. 전체 순위·튜토리얼·찜
7. 관리자 로그인 → 회원 관리 → 문제 관리
8. 관리자 채팅 열람·Judge·순위·공지·감사 로그

## 6. 연동 완료 확인 항목

- 새로고침 후에도 일반 회원과 관리자 세션이 각각 복원된다.
- 로그인 응답 `204`를 JSON으로 파싱하지 않는다.
- 상태 변경 요청에 올바른 일반·관리자 CSRF 쿠키를 구분해 전송한다.
- 회원가입 전에 이메일 인증과 필수 약관 동의가 완료된다.
- 무료 회원 열람 횟수는 상세 진입이 아니라 명시적 `unlock`에서만 차감된다.
- 유료 회원은 일일 사용량을 무제한으로 표시한다.
- 채팅과 Judge 요청에 멱등성 키를 사용하고 작업 완료까지 polling한다.
- 챌린지 전체 중지와 순위 숨김 상태를 화면에 반영한다.
- 비활성 문제는 회원 화면에 노출하지 않는다.
- 관리자 화면은 일반 회원 쿠키가 아닌 관리자 전용 쿠키와 CSRF를 사용한다.
- 로그아웃·탈퇴 후 보호 화면에 다시 접근할 수 없다.
- 유료 회원만 프로필 사진·배경을 변경할 수 있고 무료 전환 시 기본 이미지로 돌아간다.

## 7. 백엔드 구현 범위 참고

현재 Swagger에 포함된 계정, 사용량, 문제, 채팅, Judge, 순위, 공지와 관리자 API는
구현되어 있다. 다음 항목은 현재 연동 대상이 아니다.

- 학습 자료 API: 프론트엔드 정적 구현
- 관리자 홈 전용 통합 요약 API: 관리자 화면 확정 후 필요 시 구현

요청·응답의 전체 필드, enum과 validation 범위는 Swagger/OpenAPI를 최종 기준으로
사용한다. 프론트엔드는 UUID와 enum 값을 화면 표시 문자열로 변환하되 API 원문 값은
임의로 변경하지 않는다.

전달용 OpenAPI JSON은 Swagger Editor 또는 Postman에 import할 수 있다. 백엔드 API가
변경되면 배포된 `/openapi.json` 기준으로 이 파일도 함께 갱신한다.
