import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Section } from "@/components/ui/section";
import PromoCodes from "@/components/flights/PromoCodes";
import PopularDestinations from "@/components/flights/PopularDestinations";
import FlightFeatures from "@/components/flights/FlightFeatures";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

export const metadata: Metadata = {
  title: "Vé máy bay giá rẻ - ViLand Travel",
  description:
    "Tìm kiếm và đặt vé máy bay đến mọi điểm đến trên thế giới với giá tốt nhất.",
};

// Danh sách sân bay/city mẫu
const airportOptions = [
  { label: "Sân bay Tân Sơn Nhất", code: "SGN", subLabel: "TP HCM, Việt Nam" },
  { label: "Sân bay Nội Bài", code: "HAN", subLabel: "Hà Nội, Việt Nam" },
  { label: "Sân bay Đà Nẵng", code: "DAD", subLabel: "Đà Nẵng, Việt Nam" },
  { label: "Bangkok", code: "", subLabel: "Thái Lan (Tất cả sân bay)" },
  { label: "Singapore", code: "", subLabel: "Singapore (Tất cả sân bay)" },
  { label: "Kuala Lumpur", code: "", subLabel: "Malaysia (Tất cả sân bay)" },
  { label: "Seoul", code: "", subLabel: "Hàn Quốc (Tất cả sân bay)" },
  {
    label: "Sân bay quốc tế Bạch Vân",
    code: "CAN",
    subLabel: "Quảng Châu, Trung Quốc",
  },
];

const popularDestinations = [
  {
    code: "SGN",
    city: "Hồ Chí Minh",
    country: "Việt Nam",
    price: 1200000,
  },
  {
    code: "HAN",
    city: "Hà Nội",
    country: "Việt Nam",
    price: 1500000,
  },
  {
    code: "DAD",
    city: "Đà Nẵng",
    country: "Việt Nam",
    price: 900000,
  },
  {
    code: "BKK",
    city: "Bangkok",
    country: "Thái Lan",
    price: 3200000,
  },
];

export default function FlightsPage() {
  return (
    <Section className="min-h-screen bg-[#f5f7fa]">
      <Section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banner với overlay và text */}
        <div className="relative flex justify-center mb-0">
          <div className="w-full max-w-7xl relative">
            <Image
              src="/images/banner-flight.png"
              alt="Banner vé máy bay giá rẻ"
              width={1200}
              height={384}
              className="rounded-3xl w-full max-h-96 object-cover shadow-md"
              priority
            />
          </div>
        </div>

        {/* Search box nổi */}
        <div className="relative z-30 flex justify-center -mt-16 mb-14">
          <div className="bg-white rounded-3xl shadow-2xl px-8 py-7 w-full max-w-6xl flex flex-col items-center border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-3 mb-5">
              <button className="px-5 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold focus:outline-none">
                Một chiều
              </button>
              <button className="px-5 py-2 rounded-full text-gray-600 hover:bg-blue-50 font-semibold focus:outline-none">
                Khứ hồi
              </button>
              <button className="px-5 py-2 rounded-full text-gray-600 hover:bg-blue-50 font-semibold focus:outline-none">
                Nhiều thành phố
              </button>
            </div>
            {/* Form */}
            <form className="w-full flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
              {/* Điểm đi - Popover chọn sân bay */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Từ
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer">
                      <Input
                        readOnly
                        value={airportOptions[0].label}
                        className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-white cursor-pointer"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.75 19.25L3.5 12m0 0l7.25-7.25M3.5 12h17"
                          />
                        </svg>
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[350px]">
                    <div className="px-4 py-2 border-b font-semibold text-gray-700 text-sm">
                      Thành phố hoặc sân bay phổ biến
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y">
                      {airportOptions.map((item, idx) => (
                        <li
                          key={item.code}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-start gap-3"
                        >
                          <span className="mt-1 text-gray-400">
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.5 19l19-7-19-7v6l15 1-15 1v6z"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900 text-base">
                              {item.label}{" "}
                              <span className="text-xs text-gray-500 font-normal">
                                {item.code}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.subLabel}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Điểm đến - Popover chọn sân bay */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Đến
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer">
                      <Input
                        readOnly
                        value={airportOptions[1].label}
                        className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-white cursor-pointer"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.25 4.75L20.5 12m0 0l-7.25 7.25M20.5 12h-17"
                          />
                        </svg>
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[350px]">
                    <div className="px-4 py-2 border-b font-semibold text-gray-700 text-sm">
                      Thành phố hoặc sân bay phổ biến
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y">
                      {airportOptions.map((item, idx) => (
                        <li
                          key={item.code + idx}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-start gap-3"
                        >
                          <span className="mt-1 text-gray-400">
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.5 19l19-7-19-7v6l15 1-15 1v6z"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900 text-base">
                              {item.label}{" "}
                              <span className="text-xs text-gray-500 font-normal">
                                {item.code}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.subLabel}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Ngày đi - DatePicker */}
              <div className="flex-1 min-w-[170px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Ngày khởi hành
                </label>
                <DatePicker className="w-full" placeholder="Chọn ngày đi" />
              </div>
              {/* Ngày về (disabled) */}
              <div className="flex-1 min-w-[170px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Khứ hồi
                </label>
                <DatePicker className="w-full" placeholder="Chọn ngày về" />
              </div>
              {/* Nút tìm chuyến bay */}
              <div className="flex items-end">
                <Link
                  href="/flights/search"
                  prefetch={true}
                  passHref
                  legacyBehavior
                >
                  <Button
                    type="button"
                    className="w-full md:w-auto px-8 py-3 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                  >
                    Tìm chuyến bay
                  </Button>
                </Link>
              </div>
            </form>
            {/* Dòng gợi ý */}
            <div className="mt-3 text-sm text-blue-500 flex items-center gap-1 cursor-pointer hover:underline">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              Tìm ý tưởng chuyến bay thú vị ở đây
            </div>
            {/* Tùy chọn nâng cao */}
            <div className="flex flex-wrap items-center gap-5 mt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="accent-blue-600 w-4 h-4" />
                <span className="text-gray-700 text-sm">Bay thẳng</span>
              </label>
              <span className="text-gray-700 text-sm flex items-center gap-1">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 10V5a3 3 0 00-6 0v5m6 0a3 3 0 01-6 0m6 0v1a3 3 0 01-6 0v-1"
                  />
                </svg>
                1 Người lớn, 0 Trẻ em, 0 Em bé
              </span>
              <span className="text-gray-700 text-sm flex items-center gap-1">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                  />
                </svg>
                Phổ thông
              </span>
            </div>
          </div>
        </div>

        {/* Promo Codes UI */}
        <PromoCodes />

        {/* Popular Destinations */}
        <PopularDestinations />

        {/* Features */}
        <FlightFeatures />
      </Section>
    </Section>
  );
}
