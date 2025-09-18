"use client";

import { useState, useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { apiClient } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FlightBookingData } from "@/types/flight.types";
import { parseDateWithTimezone } from "@/helper/common";

// Force dynamic rendering - no SSG
export const dynamic = "force-dynamic";

export default function FlightPaymentPage() {
  // Thông tin SePay VA
  const sepayVA = {
    acc: "VQRQAEEND4527",
    bank: "MBBank",
    owner: "BACH TRAN NHAT LINH",
  };

  // Sinh link QR SePay
  const getSepayQRUrl = () => {
    if (!bookingData) return "";
    const amount = bookingData.total_amount || 0;
    const des = bookingData.booking_number || "";
    return `https://qr.sepay.vn/img?acc=${sepayVA.acc}&bank=${sepayVA.bank}&amount=${amount}&des=${des}`;
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const router = useRouter();
  // Lấy booking flight từ store
  const bookingItem = useBookingStore((state) =>
    state.items.find((i) => i.type === "flight")
  );
  const [bookingData, setBookingData] = useState<FlightBookingData | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "bank" | "wallet" | "sepay"
  >("card");
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(3);

  useEffect(() => {
    if (bookingItem && bookingItem.details) {
      setBookingData(bookingItem.details);
    }
    // Nếu không có booking, không redirect mà hiển thị thông báo ở dưới
  }, [bookingItem, router]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handlePayment = async () => {
    if (!bookingData) return;
    console.log(bookingData, "bookingData");

    setIsProcessing(true);
    try {
      if (
        paymentMethod === "sepay" ||
        paymentMethod === "bank" ||
        paymentMethod === "wallet"
      ) {
        // Lấy bookingNumber đúng từ backend (nên có trong bookingData)
        const bookingNumber = bookingData.booking_number || "";
        const paymentPayload = {
          bookingNumber,
          amount: bookingData.total_amount || 0,
          method:
            paymentMethod === "bank"
              ? "vnpay"
              : paymentMethod === "wallet"
              ? "momo"
              : paymentMethod === "sepay"
              ? "sepay"
              : "onepay",
          currency: "VND",
          gateway:
            paymentMethod === "bank"
              ? "vnpay"
              : paymentMethod === "wallet"
              ? "momo"
              : paymentMethod === "sepay"
              ? "sepay"
              : "onepay",
        };
        console.log(paymentPayload, "paymentPayload");
        const response = await apiClient.post(
          "/payments/create",
          paymentPayload
        );
        if (response && response.paymentUrl) {
          window.location.href = response.paymentUrl;
          return;
        } else if (response && response.success) {
          // Thanh toán thành công ngay (test)
          const updateItem = useBookingStore.getState().updateItem;
          if (bookingItem) {
            updateItem(bookingItem.id, {
              details: {
                ...bookingData,
                paymentStatus: "completed",
                paymentMethod,
              },
            });
          }
          console.log("booking_number:", bookingData.booking_number);
          // Truyền bookingNumber lên URL xác nhận
          router.push(
            `/flights/confirmation?code=${bookingData.booking_number}`
          );
          return;
        } else {
          throw new Error(
            response?.message || "Không thể thanh toán. Vui lòng thử lại."
          );
        }
      } else {
        // Simulate payment processing cho thẻ tín dụng (giữ nguyên logic cũ)
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const confirmationCode =
          "VN" + Math.random().toString(36).substr(2, 6).toUpperCase();
        const confirmationData = {
          ...bookingData,
          confirmationCode,
          paymentMethod,
          bookingDate: new Date().toISOString(),
          status: "confirmed",
        };
        const updateItem = useBookingStore.getState().updateItem;
        if (bookingItem) {
          updateItem(bookingItem.id, { details: confirmationData });
        }
        router.push(`/flights/confirmation?code=${confirmationCode}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      return (
        cardInfo.number && cardInfo.expiry && cardInfo.cvv && cardInfo.name
      );
    }
    return true;
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Không tìm thấy thông tin đặt vé chuyến bay.
          </h2>
          <button
            className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            onClick={() => router.push("/flights")}
          >
            Quay lại trang tìm chuyến bay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chọn phương thức thanh toán
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "card"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Thẻ tín dụng
                      </div>
                      <div className="text-sm text-gray-600">
                        Visa, Mastercard
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "bank"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Chuyển khoản ngân hàng
                      </div>
                      <div className="text-sm text-gray-600">
                        VNPay, Internet Banking
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "wallet"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2zm-8-2a3 3 0 016 0v2H9V7zm8 7a1 1 0 01-1 1H6a1 1 0 01-1-1v-5a1 1 0 011-1h10a1 1 0 011 1v5z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Ví điện tử
                      </div>
                      <div className="text-sm text-gray-600">MoMo, ZaloPay</div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setPaymentMethod("sepay")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "sepay"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-primary-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <text
                        x="10"
                        y="15"
                        textAnchor="middle"
                        fontSize="10"
                        fill="currentColor"
                      >
                        S
                      </text>
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">Sepay</div>
                      <div className="text-sm text-gray-600">Ví Sepay</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* SePay QR UI */}
            {paymentMethod === "sepay" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex flex-col items-center">
                <h3 className="font-semibold text-lg mb-3">Quét mã QR để thanh toán với SePay</h3>
                <img
                  src={getSepayQRUrl()}
                  alt="QR SePay"
                  className="w-56 h-56 mb-4 border border-gray-300 bg-white rounded-lg"
                />
                <div className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span><strong>Số tài khoản VA:</strong> {sepayVA.acc}</span>
                    <button onClick={() => handleCopy(sepayVA.acc)} className="ml-2 text-blue-600 underline">Copy</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span><strong>Ngân hàng:</strong> {sepayVA.bank}</span>
                    <button onClick={() => handleCopy(sepayVA.bank)} className="ml-2 text-blue-600 underline">Copy</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span><strong>Chủ tài khoản:</strong> {sepayVA.owner}</span>
                    <button onClick={() => handleCopy(sepayVA.owner)} className="ml-2 text-blue-600 underline">Copy</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span><strong>Số tiền:</strong> {formatPrice(bookingData.total_amount)}</span>
                    <button onClick={() => handleCopy(bookingData.total_amount.toString())} className="ml-2 text-blue-600 underline">Copy</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span><strong>Nội dung:</strong> {bookingData.booking_number}</span>
                    <button onClick={() => handleCopy(String(bookingData.booking_number))} className="ml-2 text-blue-600 underline">Copy</button>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-600 text-center">Sau khi chuyển khoản thành công, hệ thống sẽ tự động xác nhận và gửi vé về email của bạn.</p>
              </div>
            )}
            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Thông tin thẻ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số thẻ *
                    </label>
                    <input
                      type="text"
                      value={cardInfo.number}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, number: e.target.value })
                      }
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên chủ thẻ *
                    </label>
                    <input
                      type="text"
                      value={cardInfo.name}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, name: e.target.value })
                      }
                      placeholder="NGUYEN VAN A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày hết hạn *
                    </label>
                    <input
                      type="text"
                      value={cardInfo.expiry}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={cardInfo.cvv}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cvv: e.target.value })
                      }
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Bank Transfer Instructions */}
            {paymentMethod === "bank" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-lg mb-3">
                  Hướng dẫn chuyển khoản
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Ngân hàng:</strong> Vietcombank - Chi nhánh TP.HCM
                  </p>
                  <p>
                    <strong>Số tài khoản:</strong> 1234567890
                  </p>
                  <p>
                    <strong>Chủ tài khoản:</strong> CONG TY TNHH VIET NAM DU
                    LICH
                  </p>
                  <p>
                    <strong>Nội dung:</strong> FLIGHT{" "}
                    {bookingData.flight.flightNumber}{" "}
                    {bookingData.contact_info.name}
                  </p>
                  <p className="text-orange-600 font-medium">
                    Sau khi chuyển khoản, vui lòng gửi ảnh chụp biên lai để xác
                    nhận.
                  </p>
                </div>
              </div>
            )}
            {/* E-wallet Instructions */}
            {paymentMethod === "wallet" && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                <h3 className="font-semibold text-lg mb-3">
                  Thanh toán qua ví điện tử
                </h3>
                <p className="text-sm">
                  Bạn sẽ được chuyển hướng đến ứng dụng ví điện tử để hoàn tất
                  thanh toán.
                </p>
              </div>
            )}
          </div>
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Chi tiết đặt vé
              </h3>
              {/* Flight Information */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Chuyến bay</h4>
                  <span className="text-sm text-gray-600">
                    {parseDateWithTimezone(
                      bookingData.flight.departure_date
                    )?.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }) ?? ""}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {bookingData.flight.departureCity} →{" "}
                      {bookingData.flight.arrivalCity}
                    </span>
                    <span className="text-sm font-medium">
                      {parseDateWithTimezone(
                        bookingData.flight.departure_date
                      )?.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }) ?? ""}{" "}
                      -{" "}
                      {parseDateWithTimezone(
                        bookingData.flight.arrival_date
                      )?.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }) ?? ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {bookingData.flight.airline} •{" "}
                      {bookingData.flight.flightNumber}
                    </span>
                  </div>
                </div>
              </div>
              {/* Passengers */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Hành khách</h4>
                <div className="space-y-2">
                  {bookingData.passengers.map((passenger, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">
                        {passenger.title} {passenger.firstName}{" "}
                        {passenger.lastName}
                      </span>
                      <span className="text-gray-900">
                        {passenger.type === "adult"
                          ? "Người lớn"
                          : passenger.type === "child"
                          ? "Trẻ em"
                          : "Em bé"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Total Amount */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">
                    {formatPrice(bookingData.total_amount)}
                  </span>
                </div>
              </div>
              {/* Payment Button: Ẩn khi chọn SePay */}
              {paymentMethod !== "sepay" && (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !validatePayment()}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-colors ${
                    isProcessing || !validatePayment()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý thanh toán...
                    </div>
                  ) : (
                    `Thanh toán ${formatPrice(bookingData.total_amount)}`
                  )}
                </button>
              )}
              {/* Hướng dẫn khi chọn SePay */}
              {paymentMethod === "sepay" && (
                <div className="w-full py-4 px-6 rounded-lg bg-blue-100 text-blue-800 text-center font-semibold text-lg">
                  Vui lòng quét mã QR và chuyển khoản đúng thông tin để hoàn tất thanh toán.
                </div>
              )}
              {/* Security Notice */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center mb-1">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Thanh toán được bảo mật bởi SSL 256-bit
                </div>
                <p>Thông tin thẻ của bạn được mã hóa và bảo vệ tuyệt đối</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
