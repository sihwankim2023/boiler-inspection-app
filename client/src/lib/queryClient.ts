import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`${res.status}: ${message}`);
  }
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  await throwIfResNotOk(response);
  
  if (response.headers.get("content-type")?.includes("application/json")) {
    return response.json();
  }
  
  return response.text();
}

export async function apiGet(url: string): Promise<any> {
  return apiRequest(url, { method: "GET" });
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: readonly [string, ...unknown[]] }) => Promise<T> = ({
  on401,
}) => {
  return async ({ queryKey }: { queryKey: readonly [string, ...unknown[]] }) => {
    try {
      return await apiGet(queryKey[0]);
    } catch (error: any) {
      if (error.message?.includes("401") && on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      retry: (failureCount, error: any) => {
        if (error?.message?.includes("401")) return false;
        return failureCount < 3;
      },
    },
  },
});
