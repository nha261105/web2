import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
  name: string;
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (qty: number) => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

export const QuantityControl = ({
  name,
  quantity,
  maxQuantity,
  onQuantityChange,
  onIncrease,
  onDecrease,
}: QuantityControlProps) => {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-medium">{name}:</span>
        <button
          onClick={onDecrease}
          disabled={quantity === 1}
          className={`rounded-lg border p-1.5 ${
            quantity === 1
              ? "cursor-not-allowed bg-gray-50"
              : "cursor-pointer border-black/20 hover:shadow-md hover:scale-110 transition-all"
          }`}
        >
          <Minus size={18} />
        </button>
        <input
          type=""
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 1;
            onQuantityChange(Math.max(1, Math.min(value, maxQuantity)));
          }}
          className="w-12 text-center border border-black/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onIncrease}
          disabled={quantity >= maxQuantity}
          className={`rounded-lg border p-1.5 ${
            quantity >= maxQuantity
              ? "cursor-not-allowed bg-gray-50"
              : "cursor-pointer border-black/20 hover:shadow-md hover:scale-110 transition-all"
          }`}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
