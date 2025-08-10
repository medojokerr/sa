"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { paletteGrad } from "@/lib/palette"
import { useCMS } from "@/lib/store"

type Props = React.ComponentProps<typeof Button> & {
  glow?: boolean
}

export function GradientButton({ className, glow = true, ...props }: Props) {
  const { design } = useCMS()
  const palette = paletteGrad(design.palette)
  return (
    <Button
      {...props}
      className={cn(
        `relative bg-gradient-to-r ${palette.range} text-white shadow`,
        glow && "after:absolute after:inset-0 after:-z-10 after:rounded-xl after:bg-gradient-to-r after:from-violet-500/20 after:to-emerald-500/20 after:blur-lg after:content-['']",
        className
      )}
    />
  )
}
