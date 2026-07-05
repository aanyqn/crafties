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
            <main className="min-h-screen bg-[#F9F8F5] dark:bg-neutral-900 pb-16">
                <div className="max-w-[1200px] mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-[family-name:var(--font-display)] mb-8">
                        Profile
                    </h1>
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

                <div className="max-w-[1200px] mx-auto px-6 py-8">

                </div>
            </main>
            <Footer />
        </>
    )
}