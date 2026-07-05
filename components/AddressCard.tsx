"use client";

import { ReactNode, useState } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";

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
  { id: 1, label: "Rumah",  address: "Jl. Mawar No. 12", city: "Surabaya", isDefault: true  },
  { id: 2, label: "Kampus", address: "Jl. Airlangga",    city: "Surabaya", isDefault: false },
  { id: 3, label: "Kos",    address: "Jl. Ketintang",    city: "Surabaya", isDefault: false },
];

const FORM_FIELDS: { field: keyof AddressFormData; label: string; placeholder: string }[] = [
  { field: "label",   label: "Label",  placeholder: "Rumah, Kantor, Kos" },
  { field: "address", label: "Alamat", placeholder: "Jl. Mawar No. 12"   },
  { field: "city",    label: "Kota",   placeholder: "Surabaya"            },
];

/* ── Overlay ─────────────────────────────────────────── */
function Overlay({
  isOpen, onClose, children,
}: {
  isOpen: boolean; onClose: () => void; children: ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl
                   bg-white dark:bg-neutral-950
                   border border-neutral-100 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ── AddressForm ─────────────────────────────────────── */
function AddressForm({
  initialData, onSave, onClose,
}: {
  initialData: Partial<Address> | null;
  onSave: (data: AddressFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<AddressFormData>({
    label:   initialData?.label   ?? "",
    address: initialData?.address ?? "",
    city:    initialData?.city    ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof AddressFormData, string>> = {};
    if (!form.label.trim())   e.label   = "Label wajib diisi";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    if (!form.city.trim())    e.city    = "Kota wajib diisi";
    return e;
  };

  const handleSubmit = () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }
    onSave(form);
  };

  const handleChange = (field: keyof AddressFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <div className="space-y-4">
      {FORM_FIELDS.map(({ field, label, placeholder }) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1
                            text-neutral-700 dark:text-neutral-400">
            {label}
          </label>
          <input
            value={form[field]}
            onChange={handleChange(field)}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors
                        bg-white dark:bg-neutral-900
                        text-neutral-900 dark:text-neutral-100
                        placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                        ${errors[field]
                          ? "border-red-400 dark:border-red-500"                                          // ← bug fix: sebelumnya "border-red-400 dark"
                          : "border-neutral-200 dark:border-neutral-700 focus:border-[#0022FF] dark:focus:border-[#4d6bff]"
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
          className="flex-1 h-11 rounded-full border transition-colors
                     border-neutral-200 dark:border-neutral-700
                     text-neutral-600 dark:text-neutral-400
                     hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 h-11 rounded-full font-medium transition-colors text-white
                     bg-[#0022FF] hover:bg-[#0017AA]
                     dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ── AddressCard ─────────────────────────────────────── */
export default function AddressCard() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [modal, setModal] = useState<ModalState>(null);
  const closeModal = () => setModal(null);

  const setDefault = (id: number) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  const addAddress = (form: AddressFormData) => {
    setAddresses((prev) => [...prev, { id: Date.now(), ...form, isDefault: prev.length === 0 }]);
    closeModal();
  };

  const editAddress = (form: AddressFormData) => {
    if (!modal || modal.type !== "edit") return;
    setAddresses((prev) => prev.map((a) => a.id === modal.data.id ? { ...a, ...form } : a));
    closeModal();
  };

  const deleteAddress = () => {
    if (!modal || modal.type !== "delete") return;
    setAddresses((prev) => {
      const deletedWasDefault = modal.data.isDefault;
      const next = prev.filter((a) => a.id !== modal.data.id);
      if (deletedWasDefault && next.length > 0) next[0] = { ...next[0], isDefault: true };
      return next;
    });
    closeModal();
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold
                         text-neutral-900 dark:text-neutral-100">
            Addresses
          </h2>
          <button
            onClick={() => setModal({ type: "add" })}
            className="text-sm font-medium transition-opacity hover:opacity-80
                       text-[#0022FF] dark:text-[#4d6bff]"
          >
            + Add Address
          </button>
        </div>

        {/* Empty State */}
        {addresses.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border p-4 transition-colors
                          bg-white dark:bg-neutral-950
                          border-neutral-200 dark:border-neutral-800">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                            bg-neutral-100 dark:bg-neutral-800">
              {/* ← bug fix: sebelumnya text-neutral-100 → icon tidak kelihatan */}
              <MapPin className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="mb-3 text-neutral-500 dark:text-neutral-400">
              Belum ada alamat tersimpan.
            </p>
            <button
              onClick={() => setModal({ type: "add" })}
              className="font-medium text-[#0022FF] dark:text-[#4d6bff]"
            >
              Tambahkan alamat pertama
            </button>
          </div>

        ) : (
          /* Address List */
          <div className="space-y-2 rounded-2xl border p-4 transition-colors
                          bg-white dark:bg-neutral-950            
                          border-neutral-200 dark:border-neutral-800">  {/* ← bug fix: sebelumnya tidak ada dark variant */}
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-2xl border p-4 transition-colors
                  ${address.isDefault
                    ? "border-[#0022FF]/30 bg-[#0022FF]/10 dark:border-[#4d6bff]/30 dark:bg-[#4d6bff]/10"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  }`}
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold
                                     text-neutral-900 dark:text-neutral-100">
                        {address.label}
                      </h3>
                      {address.isDefault && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium
                                         bg-[#0022FF] dark:bg-[#4d6bff] text-white">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-sm mt-2
                                  text-neutral-600 dark:text-neutral-400">
                      {address.address}
                    </p>
                    <p className="text-sm
                                  text-neutral-500 dark:text-neutral-500">
                      {address.city}
                    </p>

                    {!address.isDefault && (
                      <button
                        onClick={() => setDefault(address.id)}
                        className="mt-3 text-xs font-medium px-3 py-1 rounded-lg transition-colors
                                   text-[#0022FF] dark:text-[#4d6bff]
                                   border border-[#0022FF]/30 dark:border-[#4d6bff]/30
                                   hover:bg-[#0022FF]/5 dark:hover:bg-[#4d6bff]/10"
                      >
                        Jadikan Default
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setModal({ type: "edit", data: address })}
                      aria-label="Edit Address"
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-colors
                                 text-neutral-500 dark:text-neutral-400
                                 hover:bg-neutral-100 dark:hover:bg-neutral-800
                                 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", data: address })}
                      aria-label="Delete Address"
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-colors
                                 text-red-500 dark:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-950/30
                                 hover:text-red-600 dark:hover:text-red-400"
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

      {/* Modal: Add */}
      <Overlay isOpen={modal?.type === "add"} onClose={closeModal}>
        <h3 className="font-bold text-lg mb-4
                       text-neutral-900 dark:text-neutral-100">
          Tambah Alamat
        </h3>
        <AddressForm initialData={null} onSave={addAddress} onClose={closeModal} />
      </Overlay>

      {/* Modal: Edit */}
      <Overlay isOpen={modal?.type === "edit"} onClose={closeModal}>
        <h3 className="font-bold text-lg mb-4
                       text-neutral-900 dark:text-neutral-100"> {/* ← bug fix: sebelumnya tidak ada color */}
          Edit Alamat
        </h3>
        <AddressForm
          initialData={modal?.type === "edit" ? modal.data : null}
          onSave={editAddress}
          onClose={closeModal}
        />
      </Overlay>

      {/* Modal: Delete */}
      <Overlay isOpen={modal?.type === "delete"} onClose={closeModal}>
        <h3 className="font-bold text-lg mb-2
                       text-neutral-900 dark:text-neutral-100"> {/* ← bug fix: sebelumnya tidak ada color */}
          Hapus Alamat?
        </h3>
        <p className="text-sm mb-6
                      text-neutral-500 dark:text-neutral-400">
          Apakah kamu yakin ingin menghapus alamat ini?
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 h-11 rounded-xl border transition-colors
                       border-neutral-200 dark:border-neutral-700
                       text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Batal
          </button>
          <button
            onClick={deleteAddress}
            className="flex-1 h-11 rounded-xl text-white transition-colors
                       bg-red-500 hover:bg-red-600
                       dark:bg-red-600 dark:hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </Overlay>
    </>
  );
}