interface SelectionBoxProps {
  x: number
  y: number
  width: number
  height: number
}
const SelectionBox = ({ x, y, width, height }: SelectionBoxProps) => {
  return (
    <div
      className="absolute border-2 border-accent bg-accent/10 pointer-events-none"
      style={{ left: x, top: y, width, height }}
    />
  )
}
export { SelectionBox }