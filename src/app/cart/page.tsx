import { getServerI18n } from "@/lib/i18n/server";
import CartView from "@/components/cart/cart-view";

export default async function CartPage() {
  const { dictionary } = await getServerI18n();

  return <CartView dictionary={dictionary.cart} />;
}
