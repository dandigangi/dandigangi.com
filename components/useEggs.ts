'use client'

import { useSyncExternalStore } from 'react'
import { EGGS, foundEggs, subscribe, totalEggs } from '@/lib/eggs'

/**
 * The tally, read the one way it is safe to read it.
 *
 * Both of these live in localStorage, so the server cannot know them. Calling
 * `totalEggs()` straight from a render was a hydration mismatch waiting for
 * someone to find the secret: the server counted nine, the client counted ten,
 * and React threw. `useSyncExternalStore` gives the server's answer during
 * hydration and the real one immediately after, which is the whole point of it.
 */
export const useEggCount = () => useSyncExternalStore(subscribe, foundEggs, () => 0)

export const useEggTotal = () => useSyncExternalStore(subscribe, totalEggs, () => EGGS.length)
