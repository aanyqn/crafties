import { notFound } from "next/navigation";
import { MOCK_SELLERS } from "@/data/mockSellers";

import SellerHeader from "@/components/seller/SellerHeader";
import SellerTabs from "@/components/seller/SellerTabs";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function SellerPage({ params }: Props) {
    const { id } = await params;

    const seller = MOCK_SELLERS.find((s) => s.id === id);

    if (!seller) notFound();

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9F8F5] dark:bg-neutral-900 pb-16">
                <section>
                    <div className="max-w-[1200px] mx-auto px-6 py-8">
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-display)]">
                            Crafters
                        </h1>
                    </div>
                </section>
                <section className="max-w-[1200px] mx-auto px-6">
                    <SellerHeader seller={seller} />
                    <SellerTabs seller={seller} />
                </section>
            </main>
            <Footer />
        </>
    );
}