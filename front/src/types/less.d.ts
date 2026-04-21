// Type declarations for Less CSS Modules
declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// Plain .less imports (non-module)
declare module '*.less' {
  const styles: { readonly [key: string]: string }
  export default styles
}
