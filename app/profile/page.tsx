"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ProfileCard from "@/components/ProfileCard";
import AddressCard from "@/components/AddressCard";
import OrdersCard from "@/components/OrdersCard";

export default function ProfilePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9F8F5]">
                <div className="bg-white border-b border-neutral-200">
                    <div className="max-w-[1200px] mx-auto px-6 py-8">
                        <h1 className="text-3xl font-bold text-neutral-900 font-[family-name:var(--font-display)] ">
                            My Profile
                        </h1>

                        <p className="text-sm text-neutral-500 mt-1">
                            Kelola informasi akun, alamat, dan pesananmu.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-6 py-8">
                    <div className="flex flex-col xl:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <ProfileCard />
                            <AddressCard />
                        </div>

                        <div className="xl:w-[420px]">
                            <OrdersCard />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}