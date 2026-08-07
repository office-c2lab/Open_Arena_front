import DashboardProfileSummaryCard from '@/components/Profile/DashboardProfileSummaryCard';
import AccountSettings from './MyPage';

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] bg-white px-5 py-10 sm:px-8">
      <h1 className="mb-4 text-section-title font-bold text-[#151A21]">내 정보 미리보기</h1>
      <div className="w-full lg:max-w-[796px]">
        <DashboardProfileSummaryCard />
      </div>
      <AccountSettings embedded />
    </main>
  );
}
