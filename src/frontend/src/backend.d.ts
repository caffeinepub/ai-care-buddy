import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HealthData {
    meals: Array<string>;
    waterIntake: bigint;
    medications: Array<Medication>;
    sleepHours: bigint;
    exerciseMinutes: bigint;
}
export interface EmergencyContact {
    relationship: string;
    name: string;
    phoneNumber: string;
}
export interface UserProfile {
    name: string;
}
export interface Medication {
    dosage: string;
    name: string;
    time: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEmergencyContact(contact: EmergencyContact): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmergencyContacts(user: Principal): Promise<Array<EmergencyContact>>;
    getHealthData(user: Principal): Promise<HealthData>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logHealthData(data: HealthData): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
