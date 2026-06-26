import { create } from 'zustand'

type CartStore = {
	count: number
	setCount: (count: number) => void
	increment: (by?: number) => void
	decrement: (by?: number) => void
}

export const useCartStore = create<CartStore>(set => ({
	count: 0,
	setCount: (count) => set({ count }),
	increment: (by = 1) => set(state => ({ count: state.count + by })),
	decrement: (by = 1) => set(state => ({ count: Math.max(0, state.count - by) })),
}))
