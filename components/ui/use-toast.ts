type ToastProps = {
  title: string
  description: string
  duration?: number
}

export function toast(props: ToastProps) {
  // Simplified implementation
  console.log(`Toast: ${props.title} - ${props.description}`)

  // In a real implementation, this would show a toast notification
  // For now, we'll just use browser alerts in our demo
  if (typeof window !== "undefined") {
    setTimeout(() => {
      alert(`${props.title}: ${props.description}`)
    }, 100)
  }

  return {
    dismiss: () => {
      // Dismiss functionality would go here
    },
  }
}
