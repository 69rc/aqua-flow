import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  preferredDeliveryTime: z.string().optional(),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormData & { totalLitres: number }) => void;
  isLoading: boolean;
}

export default function OrderForm({ onSubmit, isLoading }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const quantity = watch("quantity");
  const totalLitres = quantity * 20; // Assuming 20L per bag

  const handleFormSubmit = (data: OrderFormData) => {
    onSubmit({
      ...data,
      totalLitres,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          {...register("customerName")}
          placeholder="Enter customer name"
        />
        {errors.customerName && (
          <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="customerPhone">Phone Number</Label>
        <Input
          id="customerPhone"
          {...register("customerPhone")}
          placeholder="Enter phone number"
        />
        {errors.customerPhone && (
          <p className="text-sm text-red-600 mt-1">{errors.customerPhone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <Textarea
          id="deliveryAddress"
          {...register("deliveryAddress")}
          placeholder="Enter complete delivery address"
          rows={3}
        />
        {errors.deliveryAddress && (
          <p className="text-sm text-red-600 mt-1">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Number of Water Bags</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          {...register("quantity", { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Total volume: {totalLitres}L
        </p>
      </div>

      <div>
        <Label htmlFor="preferredDeliveryTime">Preferred Delivery Time</Label>
        <Select onValueChange={(value) => setValue("preferredDeliveryTime", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select preferred time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
            <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
            <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
            <SelectItem value="anytime">Anytime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Special Instructions (Optional)</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Any special delivery instructions..."
          rows={2}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Placing Order..." : "Place Order"}
      </Button>
    </form>
  );
}
