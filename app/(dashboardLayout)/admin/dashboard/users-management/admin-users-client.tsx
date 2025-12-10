"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getInputFieldError,
  type IInputErrorState,
} from "@/lib/getInputFieldError";
import { zodValidator } from "@/lib/zodValidator";
import {
  blockUser,
  createAdmin,
  deleteUser,
} from "@/services/user/user.service";
import { createAdminZodSchema } from "@/zod/user.validation";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  Ban,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface AdminUsersClientProps {
  initialData: {
    users: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    stats: {
      total: number;
      active: number;
      blocked: number;
      guides: number;
      tourists: number;
    };
    currentPage: number;
    currentLimit: number;
    roleFilter: string;
  };
}

export function AdminUsersClient({ initialData }: AdminUsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUndoDeleteDialogOpen, setIsUndoDeleteDialogOpen] = useState(false);
  const [isCreateAdminDialogOpen, setIsCreateAdminDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [adminFormData, setAdminFormData] = useState({
    name: "",
    email: "",
    password: "",
    languages: [] as string[],
  });
  const [validationErrors, setValidationErrors] =
    useState<IInputErrorState | null>(null);

  const { users, meta, stats, currentPage, currentLimit, roleFilter } =
    initialData;

  const updatePagination = useCallback(
    (page: number, limit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`/admin/dashboard/users-management?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams]
  );

  const updateRoleFilter = useCallback(
    (role: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (role !== "all") {
        params.set("role", role);
      } else {
        params.delete("role");
      }
      params.set("page", "1"); // Reset to page 1 when filter changes
      router.push(`/admin/dashboard/users-management?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams]
  );

  const handleBlockUser = async () => {
    if (!userToUpdate) return;

    try {
      const result = await blockUser({
        id: userToUpdate.id,
        isActive: "BLOCKED",
      });
      if (result.success) {
        toast.success(
          `User ${userToUpdate.name} has been blocked successfully`
        );
        setIsBlockDialogOpen(false);
        setUserToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to block user");
      }
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async () => {
    if (!userToUpdate) return;

    try {
      const result = await blockUser({
        id: userToUpdate.id,
        isActive: "ACTIVE",
      });
      if (result.success) {
        toast.success(
          `User ${userToUpdate.name} has been unblocked successfully`
        );
        setIsUnblockDialogOpen(false);
        setUserToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to unblock user");
      }
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToUpdate) return;

    try {
      const result = await deleteUser({ id: userToUpdate.id, isDeleted: true });
      if (result.success) {
        toast.success(
          `User ${userToUpdate.name} has been deleted successfully`
        );
        setIsDeleteDialogOpen(false);
        setUserToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleUndoDeleteUser = async () => {
    if (!userToUpdate) return;

    try {
      const result = await deleteUser({
        id: userToUpdate.id,
        isDeleted: false,
      });
      if (result.success) {
        toast.success(
          `User ${userToUpdate.name} has been undeleted successfully`
        );
        setIsUndoDeleteDialogOpen(false);
        setUserToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to undo delete user");
      }
    } catch (error) {
      toast.error("Failed to undo delete user");
    }
  };

  const handleCreateAdmin = async () => {
    setValidationErrors(null);

    // Prepare data for validation
    const validationData = {
      name: adminFormData.name.trim(),
      email: adminFormData.email.trim(),
      password: adminFormData.password,
      languages: adminFormData.languages,
    };

    // Zod validation
    const validation = zodValidator(validationData, createAdminZodSchema);
    if (!validation.success) {
      setValidationErrors(validation);
      const errorCount = validation.errors?.length || 0;
      const firstError = validation.errors?.[0]?.message || "Validation failed";
      if (errorCount === 1) {
        toast.error(firstError);
      } else {
        toast.error(
          `${errorCount} validation errors found. Please check the form fields.`
        );
      }
      return;
    }

    try {
      const result = await createAdmin({
        name: validationData.name,
        email: validationData.email,
        password: validationData.password,
        languages: validationData.languages,
      });
      if (result.success) {
        toast.success(
          `Admin ${adminFormData.name} has been created successfully`
        );
        setIsCreateAdminDialogOpen(false);
        setAdminFormData({ name: "", email: "", password: "", languages: [] });
        setValidationErrors(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create admin");
      }
    } catch (error) {
      toast.error("Failed to create admin");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "User ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge
            variant={
              role === "ADMIN"
                ? "default"
                : role === "GUIDE"
                ? "secondary"
                : "outline"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as string;
        return (
          <Badge variant={isActive === "ACTIVE" ? "default" : "destructive"}>
            {isActive === "ACTIVE" ? "Active" : "Blocked"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isDeleted",
      header: "Deleted",
      cell: ({ row }) => {
        const isDeleted = row.getValue("isDeleted");
        const isDeletedValue = isDeleted === true || isDeleted === "true";
        return (
          <Badge variant={isDeletedValue ? "destructive" : "default"}>
            {isDeletedValue ? "Deleted" : "Active"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      id: "languages",
      header: "Languages",
      cell: ({ row }) => {
        const languages = row.original.languages || [];
        return (
          <div className="text-sm">
            {languages.length > 0 ? languages.slice(0, 2).join(", ") : "N/A"}
            {languages.length > 2 && ` +${languages.length - 2}`}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        const isBlocked = user.isActive === "BLOCKED";
        const isDeleted = user.isDeleted === true || user.isDeleted === "true";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isBlocked ? (
                <DropdownMenuItem
                  onClick={() => {
                    setUserToUpdate({ id: user.id, name: user.name });
                    setIsUnblockDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Unblock user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setUserToUpdate({ id: user.id, name: user.name });
                    setIsBlockDialogOpen(true);
                  }}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block user
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {isDeleted ? (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => {
                    setUserToUpdate({ id: user.id, name: user.name });
                    setIsUndoDeleteDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Undo Delete
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setUserToUpdate({ id: user.id, name: user.name });
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete user
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Use stats from server (calculated from all users)
  const totalUsers = stats.total;
  const activeUsers = stats.active;
  const blockedUsers = stats.blocked;
  const guides = stats.guides;
  const tourists = stats.tourists;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div
            className="mb-8 animate-in fade-in slide-in-from-top-4"
            style={{ animationDuration: "300ms" }}
          >
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  User Management
                </h1>
                <p className="mt-2 text-muted-foreground">
                  View and manage all platform users
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={roleFilter} onValueChange={updateRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="guide">Guides</SelectItem>
                    <SelectItem value="tourist">Tourists</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsCreateAdminDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Admin
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {guides} guides • {tourists} tourists • {blockedUsers} blocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blocked Users
                </CardTitle>
                <UserX className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blockedUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Currently blocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guides</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guides}</div>
                <p className="text-xs text-muted-foreground">Total guides</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="pt-6">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    {roleFilter !== "all"
                      ? `No ${roleFilter} users found. Try selecting a different role filter.`
                      : "No users available at the moment."}
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={users}
                  searchKey="name"
                  searchPlaceholder="Search users by name..."
                  disablePagination={true}
                  initialColumnVisibility={{
                    id: false,
                  }}
                />
              )}

              {/* Pagination */}
              {users.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * currentLimit + 1} to{" "}
                      {Math.min(currentPage * currentLimit, meta.total)} of{" "}
                      {meta.total} users
                    </p>
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">Page</p>
                      <Select
                        value={`${currentPage}`}
                        onValueChange={(value) => {
                          updatePagination(Number(value), currentLimit);
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={currentPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {Array.from(
                            { length: meta.totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <SelectItem key={pageNum} value={`${pageNum}`}>
                              {pageNum}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">
                        of {meta.totalPages}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">Rows per page</p>
                      <Select
                        value={`${currentLimit}`}
                        onValueChange={(value) => {
                          updatePagination(1, Number(value));
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={currentLimit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Block User Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {userToUpdate?.name}? This will
              prevent them from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlockUser}>
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unblock User Dialog */}
      <Dialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unblock {userToUpdate?.name}? This will
              allow them to access the platform again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUnblockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUnblockUser}>Unblock User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToUpdate?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Undo Delete User Dialog */}
      <Dialog
        open={isUndoDeleteDialogOpen}
        onOpenChange={setIsUndoDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore User</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore {userToUpdate?.name}? This will
              make the user active again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUndoDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUndoDeleteUser}>Restore User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create Admin Dialog */}
      <Dialog
        open={isCreateAdminDialogOpen}
        onOpenChange={(open) => {
          setIsCreateAdminDialogOpen(open);
          if (!open) {
            setAdminFormData({
              name: "",
              email: "",
              password: "",
              languages: [],
            });
            setValidationErrors(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin</DialogTitle>
            <DialogDescription>
              Create a new admin user account. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Name</Label>
              <Input
                id="admin-name"
                placeholder="Admin name"
                value={adminFormData.name}
                onChange={(e) => {
                  setAdminFormData({ ...adminFormData, name: e.target.value });
                  // Clear validation error for this field when user types
                  if (validationErrors?.errors) {
                    setValidationErrors({
                      ...validationErrors,
                      errors: validationErrors.errors.filter(
                        (err) => err.field !== "name"
                      ),
                    });
                  }
                }}
                className={
                  getInputFieldError("name", validationErrors)
                    ? "border-destructive"
                    : ""
                }
              />
              {getInputFieldError("name", validationErrors) && (
                <p className="text-sm text-destructive">
                  {getInputFieldError("name", validationErrors)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={adminFormData.email}
                onChange={(e) => {
                  setAdminFormData({ ...adminFormData, email: e.target.value });
                  // Clear validation error for this field when user types
                  if (validationErrors?.errors) {
                    setValidationErrors({
                      ...validationErrors,
                      errors: validationErrors.errors.filter(
                        (err) => err.field !== "email"
                      ),
                    });
                  }
                }}
                className={
                  getInputFieldError("email", validationErrors)
                    ? "border-destructive"
                    : ""
                }
              />
              {getInputFieldError("email", validationErrors) && (
                <p className="text-sm text-destructive">
                  {getInputFieldError("email", validationErrors)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Password"
                value={adminFormData.password}
                onChange={(e) => {
                  setAdminFormData({
                    ...adminFormData,
                    password: e.target.value,
                  });
                  // Clear validation error for this field when user types
                  if (validationErrors?.errors) {
                    setValidationErrors({
                      ...validationErrors,
                      errors: validationErrors.errors.filter(
                        (err) => err.field !== "password"
                      ),
                    });
                  }
                }}
                className={
                  getInputFieldError("password", validationErrors)
                    ? "border-destructive"
                    : ""
                }
              />
              {getInputFieldError("password", validationErrors) && (
                <p className="text-sm text-destructive">
                  {getInputFieldError("password", validationErrors)}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateAdminDialogOpen(false);
                setAdminFormData({
                  name: "",
                  email: "",
                  password: "",
                  languages: [],
                });
                setValidationErrors(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin}>Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
