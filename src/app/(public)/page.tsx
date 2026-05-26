import { sellerService } from '@/services/seller'
import ProductCard from '@/components/product-card'

export default async function HomePage() {
  const { items } = await sellerService.getItems()
  
return (
    <>
      <section className="mb-8">
        <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
          Bienvenido a MateandoAndo
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
          Descubrí los mejores productos artesanales de mate. Kits, termos, yerbas y accesorios seleccionados por vendedores de confianza.
        </p>
      </section>
    

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline-md font-headline-md text-on-surface">
            Todos los productos
          </h2>
          <span className="text-label-sm text-on-surface-variant">
            {items.length} productos
          </span>
        </div>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <p className="text-body-md">
              No hay productos disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard
                key={item.id_item}
                id_item={item.id_item}
                name={item.name}
                description={item.description}
                price={item.price}
                category_name={item.category_name}
                seller_name={item.seller_name}
                discount_pct={item.discount_pct}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}