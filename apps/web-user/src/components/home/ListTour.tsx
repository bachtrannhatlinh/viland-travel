'use client'


import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { Section } from "@/components/ui/section";
import { WordIcon } from "./WordIcon";
import { PdfIcon } from "./PdfIcon";
import { TOUR_LIST } from "@/constants/tourList";

export const ListTour: React.FC = () => {
  return (
    <Section className="max-w-5xl mx-auto py-10 px-2 md:px-0">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-10">
        <Typography variant="h2" className="mb-8 text-center text-3xl font-bold text-primary-700 tracking-tight uppercase">Danh sách Tour</Typography>
        <div className="overflow-x-auto" style={{ maxHeight: 500, minHeight: 300, overflowY: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 text-base text-primary-700 text-center">Tên tour</TableHead>
                <TableHead className="w-1/6 text-base text-primary-700 text-center">Thời gian</TableHead>
                <TableHead className="w-1/5 text-base text-primary-700 text-center">Ngày khởi hành</TableHead>
                <TableHead className="w-1/6 text-base text-primary-700 text-center">Giá tour</TableHead>
                <TableHead className="w-1/6 text-base text-primary-700 text-center">Tải tài liệu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOUR_LIST.map((tour) => (
                <TableRow key={tour.id} className="hover:bg-blue-50 transition-all">
                  <TableCell className="align-top py-4">
                    <Typography variant="large" className="font-bold mb-1 block text-primary-800 leading-snug">{tour.title}</Typography>
                    <Typography variant="small" className="text-gray-600 leading-normal mt-1">{tour.short_description}</Typography>
                  </TableCell>
                  <TableCell className="align-top py-4 text-center font-medium text-gray-700">{tour.duration}</TableCell>
                  <TableCell className="align-top py-4 text-center">
                    <span className="font-medium text-gray-700">{tour.startDate}</span>
                    <br/>
                    <span className="text-xs text-gray-400">Bay từ Đà Nẵng</span>
                  </TableCell>
                  <TableCell className="align-top py-4 text-center">
                    <span className="text-2xl font-extrabold text-blue-600">{tour.price_adult.toLocaleString("vi-VN")}</span>
                    <span className="text-xs font-semibold text-blue-600 ml-1">{tour.currency}</span>
                  </TableCell>
                  <TableCell className="align-top py-4 flex gap-3 items-center justify-center">
                    {tour.fileWordUrl && (
                      <a href={tour.fileWordUrl} download title="Tải file Word" className="hover:scale-110 transition-transform">
                        <WordIcon style={{ display: "inline" }} />
                      </a>
                    )}
                    {tour.filePdfUrl && (
                      <a href={tour.filePdfUrl} download title="Tải file PDF" className="hover:scale-110 transition-transform">
                        <PdfIcon style={{ display: "inline" }} />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Section>
  );
};
