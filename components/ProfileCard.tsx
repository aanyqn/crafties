"use client";

import { useState } from "react";
import {Pencil} from "lucide-react"

export default function ProfileCard() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-28 h-28 rounded-full bg-neutral-200" />

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-neutral-900">
                            Ainul Yaqin
                        </h2>

                        <div className="mt-4 space-y-2 text-sm text-neutral-600">
                            <p>yaqin@gmail.com</p>
                            <p>+62 812 3456 7890</p>
                            <p>@ainulyaqin</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(true)}
                        className="px-5 py-2.5 flex items-center justify-center rounded-full bg-[#0022FF] text-white text-sm font-medium hover:bg-[#0017AA] transition-colors cursor-pointer"
                    >
                        <Pencil size={16} />
                    </button>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-[300] flex items-center p-4 justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-5">
                            Edit Profile
                        </h2>

                        <div className="space-y-4">
                            <input
                                defaultValue="Ainul Yaqin"
                                className="w-full h-11 px-4 border border-neutral-200 rounded-xl"
                                placeholder="Nama"
                            />

                            <input
                                defaultValue="yaqin@gmail.com"
                                className="w-full h-11 px-4 border border-neutral-200 rounded-xl"
                                placeholder="Email"
                            />

                            <input
                                defaultValue="+62 812 3456 7890"
                                className="w-full h-11 px-4 border border-neutral-200 rounded-xl"
                                placeholder="Phone"
                            />

                            <input
                                defaultValue="@ainulyaqin"
                                className="w-full h-11 px-4 border border-neutral-200 rounded-xl"
                                placeholder="Username"
                            />
                        </div>

                        <div className="flex justify-end w-full gap-3 mt-6">
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 h-11 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 h-11 rounded-full bg-[#0022FF] text-white font-medium hover:bg-[#0017AA] transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}