import { Section } from "@/components/ui/section";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PromoCodes() {
  return (
    <Section className="max-w-6xl mx-auto mt-16">
      <Typography variant="h2" className="mb-6 text-2xl font-bold">
        Đặt vé trên web, mở app dùng mã ngay!
      </Typography>
      <div className="flex gap-3 mb-6">
        <Button variant="secondary" className="rounded-full px-6 py-2 text-base font-semibold text-blue-600 bg-blue-100">
          Mã thanh toán
        </Button>
        <Button variant="ghost" className="rounded-full px-6 py-2 text-base font-semibold text-gray-600 bg-gray-100">
          Mã Traveloka
        </Button>
        <Button variant="ghost" className="rounded-full px-6 py-2 text-base font-semibold text-gray-600 bg-gray-100">
          Mã đối tác
        </Button>
      </div>
      <div className="flex gap-6 flex-wrap">
        {/* Card 1 */}
        <Card className="flex-1 min-w-[320px] max-w-md flex flex-col p-0">
          <div className="flex items-center gap-3 px-6 pt-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13V5a2 2 0 012-2h2a2 2 0 012 2v16" /></svg>
            </div>
            <div>
              <Typography variant="large" className="font-bold">Giảm giá 300K VNĐ</Typography>
              <Typography variant="muted">Giao dịch tối thiểu 5 triệu VND bằng thẻ tín dụng SeABank</Typography>
            </div>
            <span className="ml-auto text-gray-400 cursor-pointer" title="Thông tin"><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h.01M12 12v4" /></svg></span>
          </div>
          <CardContent className="flex items-center gap-3 pt-4 pb-6">
            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 font-mono text-base text-gray-700 select-all">SB300</div>
            <Button size="sm" className="bg-blue-100 text-blue-600 font-semibold rounded-full px-5">Copy</Button>
          </CardContent>
        </Card>
        {/* Card 2 */}
        <Card className="flex-1 min-w-[320px] max-w-md flex flex-col p-0 relative">
          <span className="absolute left-6 top-4 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded text-white">hết mã</span>
          <div className="flex items-center gap-3 px-6 pt-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13V5a2 2 0 012-2h2a2 2 0 012 2v16" /></svg>
            </div>
            <div>
              <Typography variant="large" className="font-bold">Giảm 250K VNĐ</Typography>
              <Typography variant="muted">Tối thiểu. giao dịch 2.5 triệu đồng sử dụng tất cả thẻ tín dụng KBank Cashback Plus</Typography>
            </div>
            <span className="ml-auto text-gray-400 cursor-pointer" title="Thông tin"><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h.01M12 12v4" /></svg></span>
          </div>
          <CardContent className="flex items-center gap-3 pt-4 pb-6">
            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 font-mono text-base text-gray-700 select-all">KBANKFLIGHT25</div>
            <Button size="sm" className="bg-blue-100 text-blue-600 font-semibold rounded-full px-5">Copy</Button>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
