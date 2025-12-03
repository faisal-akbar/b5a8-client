export type UserRole = "ADMIN" | "GUIDE" | "TOURIST";

// exact : ["/my-profile", "settings"]
//   patterns: [/^\/dashboard/, /^\/tourist/], // Routes starting with /dashboard/* /tourist/*
export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

export const authRoutes = ["/login", "/register", "/forgot-password"];

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/profile", "/settings", "/change-password", "/reset-password"],
    patterns: [], 
}

export const guideProtectedRoutes: RouteConfig = {
    patterns: [/^\/guide\/dashboard/], // Routes starting with /guide/dashboard/*
    exact: ["/guide/dashboard"], // Exact match for /guide/dashboard
}

export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin\/dashboard/], // Routes starting with /admin/dashboard/*
    exact: ["/admin/dashboard"], // Exact match for /admin/dashboard
}

export const touristProtectedRoutes: RouteConfig = {
    patterns: [/^\/tourist\/dashboard/], // Routes starting with /tourist/dashboard/*
    exact: ["/tourist/dashboard"], // Exact match for /tourist/dashboard
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
    // if pathname === /tourist/dashboard/bookings => matches /^\/tourist/ => true
}

export const getRouteOwner = (pathname: string): "ADMIN" | "GUIDE" | "TOURIST" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, guideProtectedRoutes)) {
        return "GUIDE";
    }
    if (isRouteMatches(pathname, touristProtectedRoutes)) {
        return "TOURIST";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "GUIDE") {
        return "/guide/dashboard";
    }
    if (role === "TOURIST") {
        return "/tourist/dashboard";
    }
    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}

