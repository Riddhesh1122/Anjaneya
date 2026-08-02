type SearchInputProps = {
  placeholder?: string
  ariaLabel: string
}

export function SearchInput({ placeholder = 'Search events, workshops, clubs...', ariaLabel }: SearchInputProps) {
  return (
    <input
      className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/60"
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  )
}
