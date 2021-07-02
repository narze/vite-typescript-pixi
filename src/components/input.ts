import { defineComponent, Types } from "bitecs"

export const Input = defineComponent({
  up: Types.i8,
  down: Types.i8,
  left: Types.i8,
  right: Types.i8,
})
