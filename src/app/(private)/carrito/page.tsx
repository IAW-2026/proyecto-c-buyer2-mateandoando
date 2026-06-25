import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import CartContent from '@/components/cart/cart-content'

type EnrichedCartItem = {
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
        image_url: string | null
    }
}

export default async function CarritoPage() {
    const { userId } = await auth()
    
    const buyer = await db.buyer.findUnique({
        where: { clerk_user_id: userId! },
        select: { id_buyer: true },
    })
    
    if (!buyer) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <p className="text-body-md">
                    Cuenta de comprador no encontrada.
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
        (item): item is EnrichedCartItem => item !== null
    )

    // Fetch stock for each cart item from the detail endpoint (the only one that returns stock)
    const stockEntries = await Promise.all(
        validItems.map(async item => {
            const detail = await sellerService.getItemDetail(item.product.category_name, item.id_item)
            return [item.id_item, detail?.stock ?? null] as const
        })
    )
    const stockMap = Object.fromEntries(stockEntries)

    const itemsWithStock = validItems.map(item => ({
        ...item,
        product: { ...item.product, stock: stockMap[item.id_item] ?? null },
    }))
    
    const productText = validItems.length === 1 ? 'producto' : 'productos'
    const emptyCartText = 'Tu carrito está vacío.'

    return (
            <>
                <section className="mb-8">
                    <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
                        Mi Carrito
                    </h1>

                    <p className="text-body-lg font-body-lg text-on-surface-variant">
                        {
                            validItems.length === 0 ?
                                emptyCartText :
                                `${validItems.length} ${productText} en tu carrito.`
                        }
                    </p>
                </section>
                    
                <CartContent initialItems={itemsWithStock} />
            </>
        )
    }