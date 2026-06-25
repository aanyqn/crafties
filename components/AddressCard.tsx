"use client";

import { ReactNode, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const BRAND = "#0022FF";

type Address = {
    id: number;
    label: string;
    address: string;
    city: string;
    isDefault: boolean;
};

type AddressFormData = {
    label: string;
    address: string;
    city: string;
};

type ModalState =
    | { type: "add" }
    | { type: "edit"; data: Address }
    | { type: "delete"; data: Address }
    | null;

const INITIAL_ADDRESSES: Address[] = [
    {
        id: 1,
        label: "Rumah",
        address: "Jl. Mawar No. 12",
        city: "Surabaya",
        isDefault: true,
    },
    {
        id: 2,
        label: "Kampus",
        address: "Jl. Airlangga",
        city: "Surabaya",
        isDefault: false,
    },
    {
        id: 3,
        label: "Kos",
        address: "Jl. Ketintang",
        city: "Surabaya",
        isDefault: false,
    },
];

function Overlay({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

const FORM_FIELDS: {
    field: keyof AddressFormData;
    label: string;
    placeholder: string;
}[] = [
        {
            field: "label",
            label: "Label",
            placeholder: "Rumah, Kantor, Kos",
        },
        {
            field: "address",
            label: "Alamat",
            placeholder: "Jl. Mawar No. 12",
        },
        {
            field: "city",
            label: "Kota",
            placeholder: "Surabaya",
        },
    ];

function AddressForm({
    initialData,
    onSave,
    onClose,
}: {
    initialData: Partial<Address> | null;
    onSave: (data: AddressFormData) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState<AddressFormData>({
        label: initialData?.label ?? "",
        address: initialData?.address ?? "",
        city: initialData?.city ?? "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof AddressFormData, string>>
    >({});

    const validate = () => {
        const e: Partial<Record<keyof AddressFormData, string>> = {};

        if (!form.label.trim()) {
            e.label = "Label wajib diisi";
        }

        if (!form.address.trim()) {
            e.address = "Alamat wajib diisi";
        }

        if (!form.city.trim()) {
            e.city = "Kota wajib diisi";
        }

        return e;
    };

    const handleSubmit = () => {
        const validation = validate();

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        onSave(form);
    };

    const handleChange =
        (field: keyof AddressFormData) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;

                setForm((prev) => ({
                    ...prev,
                    [field]: value,
                }));

                if (errors[field]) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: undefined,
                    }));
                }
            };

    return (
        <div className="space-y-4">
            {FORM_FIELDS.map(({ field, label, placeholder }) => (
                <div key={field}>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {label}
                    </label>

                    <input
                        value={form[field]}
                        onChange={handleChange(field)}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors ${errors[field]
                                ? "border-red-400"
                                : "border-neutral-200 focus:border-[#0022FF]"
                            }`}
                    />

                    {errors[field] && (
                        <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
                    )}
                </div>
            ))}

            <div className="flex gap-3 pt-2">
                <button
                    onClick={onClose}
                    className="flex-1 h-11 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    className="flex-1 h-11 rounded-full bg-[#0022FF] text-white font-medium hover:bg-[#0017AA] transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

function LocationIcon() {
    return (
        <svg
            className="w-6 h-6 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

export default function AddressCard() {
    const [addresses, setAddresses] =
        useState<Address[]>(INITIAL_ADDRESSES);

    const [modal, setModal] = useState<ModalState>(null);

    const closeModal = () => setModal(null);

    const setDefault = (id: number) => {
        setAddresses((prev) =>
            prev.map((address) => ({
                ...address,
                isDefault: address.id === id,
            }))
        );
    };

    const addAddress = (form: AddressFormData) => {
        setAddresses((prev) => [
            ...prev,
            {
                id: Date.now(),
                ...form,
                isDefault: prev.length === 0,
            },
        ]);

        closeModal();
    };

    const editAddress = (form: AddressFormData) => {
        if (!modal || modal.type !== "edit") return;

        setAddresses((prev) =>
            prev.map((address) =>
                address.id === modal.data.id
                    ? { ...address, ...form }
                    : address
            )
        );

        closeModal();
    };

    const deleteAddress = () => {
        if (!modal || modal.type !== "delete") return;

        setAddresses((prev) => {
            const deletedWasDefault = modal.data.isDefault;

            const next = prev.filter(
                (address) => address.id !== modal.data.id
            );

            if (deletedWasDefault && next.length > 0) {
                next[0] = {
                    ...next[0],
                    isDefault: true,
                };
            }

            return next;
        });

        closeModal();
    };

    return (
        <>
            <div className="">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-neutral-900">
                        Addresses
                    </h2>

                    <button
                        onClick={() => setModal({ type: "add" })}
                        className="text-sm font-medium text-[#0022FF] hover:opacity-80 transition-opacity"
                    >
                        + Add Address
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="py-10 text-center rounded-2xl border p-4 transition-colors border-neutral-200 bg-white">
                        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                            <LocationIcon />
                        </div>

                        <p className="text-neutral-500 mb-3">
                            Belum ada alamat tersimpan.
                        </p>

                        <button
                            onClick={() => setModal({ type: "add" })}
                            className="font-medium text-[#0022FF]"
                        >
                            Tambahkan alamat pertama
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2 rounded-2xl border p-4 transition-colors border-neutral-200 bg-white">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`rounded-2xl border p-4 transition-colors ${address.isDefault
                                        ? "border-[#0022FF]/30 bg-[#0022FF]/10"
                                        : "border-neutral-200 bg-white"
                                    }`}
                            >
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold">
                                                {address.label}
                                            </h3>

                                            {address.isDefault && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#0022FF] text-white">
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-neutral-600 mt-2">
                                            {address.address}
                                        </p>

                                        <p className="text-sm text-neutral-500">
                                            {address.city}
                                        </p>

                                        {!address.isDefault && (
                                            <button
                                                onClick={() => setDefault(address.id)}
                                                className="mt-3 text-xs font-medium text-[#0022FF] border border-[#0022FF]/30 px-3 py-1 rounded-lg hover:bg-[#0022FF]/5"
                                            >
                                                Jadikan Default
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() =>
                                                setModal({
                                                    type: "edit",
                                                    data: address,
                                                })
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                                            aria-label="Edit Address"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setModal({
                                                    type: "delete",
                                                    data: address,
                                                })
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            aria-label="Delete Address"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Overlay isOpen={modal?.type === "add"} onClose={closeModal}>
                <h3 className="font-bold text-lg mb-4">
                    Tambah Alamat
                </h3>

                <AddressForm
                    initialData={null}
                    onSave={addAddress}
                    onClose={closeModal}
                />
            </Overlay>

            <Overlay isOpen={modal?.type === "edit"} onClose={closeModal}>
                <h3 className="font-bold text-lg mb-4">
                    Edit Alamat
                </h3>

                <AddressForm
                    initialData={modal?.type === "edit" ? modal.data : null}
                    onSave={editAddress}
                    onClose={closeModal}
                />
            </Overlay>

            <Overlay isOpen={modal?.type === "delete"} onClose={closeModal}>
                <h3 className="font-bold text-lg mb-2">
                    Hapus Alamat?
                </h3>

                <p className="text-sm text-neutral-500 mb-6">
                    Apakah kamu yakin ingin menghapus alamat ini?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={closeModal}
                        className="flex-1 h-11 rounded-xl border border-neutral-200"
                    >
                        Batal
                    </button>

                    <button
                        onClick={deleteAddress}
                        className="flex-1 h-11 rounded-xl bg-red-500 text-white hover:bg-red-600"
                    >
                        Hapus
                    </button>
                </div>
            </Overlay>
        </>
    );
}