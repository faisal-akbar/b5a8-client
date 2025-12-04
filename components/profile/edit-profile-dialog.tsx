"use client"

import { useState } from "react"
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
import { Camera, X } from "lucide-react"

interface EditProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: {
        name: string
        email: string
        bio?: string | null
        profilePic?: string | null
        languages: string[]
    }
    onSave?: (data: any) => void
}

export function EditProfileDialog({
    open,
    onOpenChange,
    profile,
    onSave,
}: EditProfileDialogProps) {
    const [formData, setFormData] = useState({
        name: profile.name,
        bio: profile.bio || "",
        languages: profile.languages,
    })
    const [newLanguage, setNewLanguage] = useState("")

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

    const handleSave = () => {
        onSave?.(formData)
        onOpenChange(false)
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
                                <AvatarImage src={profile.profilePic || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {profile.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground">Profile Picture</h3>
                            <p className="text-sm text-muted-foreground">
                                Click the camera icon to upload a new photo
                            </p>
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
                                        onClick={() => handleRemoveLanguage(lang)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
