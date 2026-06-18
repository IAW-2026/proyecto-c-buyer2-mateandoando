import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import CheckoutForm from '@/components/checkout/checkout-content'

type CartItemWithProduct = {
    id_cart_item: string
    id_item: string
    quantity: number
    product: {
        id_item: string
        name: string
        price: number
        description: string
        category_name: string
        id_seller: string
        seller_name: string
        discount_pct: number
    }
}

export default async function CheckoutPage() {
    const { userId } = await auth()
    
    const buyer = await db.buyer.findUnique({
        where: { clerk_user_id: userId! },
        select: { id_buyer: true },
    })
    
    if (!buyer) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <p className="text-body-md">
                    No se encontró tu cuenta de comprador.
                </p>
            </div>
        )
    }
    
    // find cart for buyer
    const cart = await db.cart.findUnique({
        where: { id_buyer: buyer.id_buyer },
        include: { items: true },
    })
    
    const cartItems = cart?.items ?? []
    
    if (cartItems.length === 0) {
        // cart is empty

        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
                <p className="text-body-md">
                    Tu carrito está vacío.
                </p>
            </div>
        )
    }
    
    const { items: allItems } = await sellerService.getItems()
    const itemMap: Record<string, typeof allItems[number]> = Object.fromEntries(
        allItems.map(item => [item.id_item, item])
    )

    const enriched = cartItems.map(cartItem => {
        const product = itemMap[cartItem.id_item]
        
        if (!product)
            return null

        return {
            id_cart_item: cartItem.id_cart_item,
            id_item: cartItem.id_item,
            quantity: cartItem.quantity,
            product,
        }
    })
    
    const validItems = enriched.filter(
        (item): item is CartItemWithProduct => item !== null
    )
    
    return (
        <>
            <section className="mb-8">
                <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
                    Checkout
                </h1>

                <p className="text-body-lg font-body-lg text-on-surface-variant">
                    Completá tu dirección de envío para finalizar la compra.
                </p>
            </section>

            <CheckoutForm
                items={validItems}
                id_buyer={buyer.id_buyer}
            />
        </>
    )
}