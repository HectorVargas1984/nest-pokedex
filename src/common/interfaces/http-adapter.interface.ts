export interface HttpAdapter {
  // implementacion del patron adapter

  get<T>(url: string): Promise<T>;
}
