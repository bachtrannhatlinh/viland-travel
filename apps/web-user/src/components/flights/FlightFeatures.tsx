import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Section } from "@/components/ui/section";

export default function FlightFeatures() {
  return (
    <Section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
      <Card className="flex flex-col items-center text-center border-0 shadow-none">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Typography variant="large" className="mb-2">Tìm kiếm thông minh</Typography>
        <Typography variant="muted">So sánh giá từ hàng trăm hãng hàng không để tìm ưu đãi tốt nhất</Typography>
      </Card>
      <Card className="flex flex-col items-center text-center border-0 shadow-none">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <Typography variant="large" className="mb-2">Đặt vé an toàn</Typography>
        <Typography variant="muted">Hệ thống thanh toán bảo mật và chính sách hoàn tiền linh hoạt</Typography>
      </Card>
      <Card className="flex flex-col items-center text-center border-0 shadow-none">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 9.75 9.75c0-.372-.036-.74-.103-1.103a9.75 9.75 0 0 0-9.647-8.647Z" />
          </svg>
        </div>
        <Typography variant="large" className="mb-2">Hỗ trợ 24/7</Typography>
        <Typography variant="muted">Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc</Typography>
      </Card>
    </Section>
  );
}
