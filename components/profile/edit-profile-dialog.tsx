"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, X, Loader2 } from "lucide-react"
import { updateUser } from "@/services/user/user.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EditProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: {
        id: string
        name: string
        email: string
        bio?: string | null
        profilePic?: string | null
        languages: string[]
        role?: "TOURIST" | "GUIDE" | "ADMIN" | "SUPER_ADMIN"
        // Guide-specific fields
        expertise?: string[]
        dailyRate?: number
        // Tourist-specific fields
        travelPreferences?: string[]
    }
    onSave?: () => void
}

export function EditProfileDialog({
    open,
    onOpenChange,
    profile,
    onSave,
}: EditProfileDialogProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(profile.profilePic || null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    
    const [formData, setFormData] = useState({
        name: profile.name,
        bio: profile.bio || "",
        languages: profile.languages,
        // Role-specific fields
        expertise: profile.expertise || [],
        dailyRate: profile.dailyRate?.toString() || "",
        travelPreferences: profile.travelPreferences || [],
    })
    
    const [newLanguage, setNewLanguage] = useState("")
    const [newExpertise, setNewExpertise] = useState("")
    const [newTravelPreference, setNewTravelPreference] = useState("")

    // Reset form when profile changes
    useEffect(() => {
        if (open) {
            setFormData({
                name: profile.name,
                bio: profile.bio || "",
                languages: profile.languages,
                expertise: profile.expertise || [],
                dailyRate: profile.dailyRate?.toString() || "",
                travelPreferences: profile.travelPreferences || [],
            })
            setPreviewImage(profile.profilePic || null)
            setSelectedFile(null)
        }
    }, [profile, open])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAddLanguage = () => {
        if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
            setFormData({
                ...formData,
                languages: [...formData.languages, newLanguage.trim()],
            })
            setNewLanguage("")
        }
    }

    const handleRemoveLanguage = (lang: string) => {
        setFormData({
            ...formData,
            languages: formData.languages.filter((l) => l !== lang),
        })
    }

    const handleAddExpertise = () => {
        if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
            setFormData({
                ...formData,
                expertise: [...formData.expertise, newExpertise.trim()],
            })
            setNewExpertise("")
        }
    }

    const handleRemoveExpertise = (exp: string) => {
        setFormData({
            ...formData,
            expertise: formData.expertise.filter((e) => e !== exp),
        })
    }

    const handleAddTravelPreference = () => {
        if (newTravelPreference.trim() && !formData.travelPreferences.includes(newTravelPreference.trim())) {
            setFormData({
                ...formData,
                travelPreferences: [...formData.travelPreferences, newTravelPreference.trim()],
            })
            setNewTravelPreference("")
        }
    }

    const handleRemoveTravelPreference = (pref: string) => {
        setFormData({
            ...formData,
            travelPreferences: formData.travelPreferences.filter((p) => p !== pref),
        })
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const updatePayload: any = {
                id: profile.id,
                name: formData.name,
                bio: formData.bio,
                languages: formData.languages,
            }

            // Add role-specific fields
            if (profile.role === "GUIDE") {
                updatePayload.expertise = formData.expertise
                if (formData.dailyRate) {
                    updatePayload.dailyRate = parseFloat(formData.dailyRate)
                }
            } else if (profile.role === "TOURIST") {
                updatePayload.travelPreferences = formData.travelPreferences
            }

            // Add profile picture if selected
            if (selectedFile) {
                updatePayload.profilePic = selectedFile
            }

            const result = await updateUser(updatePayload)

            if (result.success) {
                toast.success("Profile updated successfully")
                onSave?.()
                router.refresh()
                onOpenChange(false)
            } else {
                toast.error(result.message || "Failed to update profile")
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information and preferences
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={previewImage || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {formData.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground">Profile Picture</h3>
                            <p className="text-sm text-muted-foreground">
                                Click the camera icon to upload a new photo
                            </p>
                            {selectedFile && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="h-11"
                        />
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={profile.email}
                            disabled
                            className="h-11 bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            className="min-h-[120px] resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {formData.bio.length}/500 characters
                        </p>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                        <Label>Languages</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddLanguage()
                                    }
                                }}
                                placeholder="Add a language"
                                className="h-11"
                            />
                            <Button
                                type="button"
                                onClick={handleAddLanguage}
                                variant="secondary"
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.languages.map((lang) => (
                                <Badge
                                    key={lang}
                                    variant="secondary"
                                    className="gap-1 px-3 py-1.5"
                                >
                                    {lang}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLanguage(lang)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Guide-specific fields */}
                    {profile.role === "GUIDE" && (
                        <>
                            <div className="space-y-2">
                                <Label>Expertise</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newExpertise}
                                        onChange={(e) => setNewExpertise(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddExpertise()
                                            }
                                        }}
                                        placeholder="Add expertise (e.g., History, Food)"
                                        className="h-11"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddExpertise}
                                        variant="secondary"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.expertise.map((exp) => (
                                        <Badge
                                            key={exp}
                                            variant="secondary"
                                            className="gap-1 px-3 py-1.5"
                                        >
                                            {exp}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExpertise(exp)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                                <Input
                                    id="dailyRate"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.dailyRate}
                                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                                    placeholder="Enter your daily rate"
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    How much you charge per day for guiding services
                                </p>
                            </div>
                        </>
                    )}

                    {/* Tourist-specific fields */}
                    {profile.role === "TOURIST" && (
                        <div className="space-y-2">
                            <Label>Travel Preferences</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newTravelPreference}
                                    onChange={(e) => setNewTravelPreference(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleAddTravelPreference()
                                        }
                                    }}
                                    placeholder="Add preference (e.g., Culture, Food, Adventure)"
                                    className="h-11"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTravelPreference}
                                    variant="secondary"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.travelPreferences.map((pref) => (
                                    <Badge
                                        key={pref}
                                        variant="secondary"
                                        className="gap-1 px-3 py-1.5"
                                    >
                                        {pref}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTravelPreference(pref)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
