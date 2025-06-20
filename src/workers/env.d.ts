// Vite の `new URL('...', import.meta.url)` で worker を型安全に
declare module '*?worker' {
  const WorkerFactory: { new (): Worker };
  export default WorkerFactory;
}

