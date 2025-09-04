import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const popularDestinations = [
  { code: "SGN", city: "Hồ Chí Minh", country: "Việt Nam", price: 1200000 },
  { code: "HAN", city: "Hà Nội", country: "Việt Nam", price: 1500000 },
  { code: "DAD", city: "Đà Nẵng", country: "Việt Nam", price: 900000 },
  { code: "BKK", city: "Bangkok", country: "Thái Lan", price: 3200000 },
];

export default function PopularDestinations() {
  return (
    <div className="mb-14 max-w-6xl mx-auto mt-16">
      <Typography variant="h2" className="mb-7">
        Điểm đến phổ biến
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {popularDestinations.map((destination) => (
          <Card
            key={destination.code}
            className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-transparent hover:border-blue-400"
          >
            <div className="w-full h-36 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Typography
                variant="h3"
                className="text-white text-3xl font-bold tracking-widest drop-shadow-lg"
              >
                {destination.code}
              </Typography>
            </div>
            <CardContent className="p-5">
              <Typography variant="large" className="font-bold mb-1">
                {destination.city}
              </Typography>
              <Typography variant="muted" className="mb-2">
                {destination.country}
              </Typography>
              <Typography className="text-blue-600 font-semibold text-base">
                Từ {destination.price.toLocaleString("vi-VN")} VND
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
