import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type UserProfile = {
    name : Text;
  };

  public type HealthData = {
    exerciseMinutes : Nat;
    meals : [Text];
    waterIntake : Nat;
    sleepHours : Nat;
    medications : [Medication];
  };

  public type Medication = {
    name : Text;
    dosage : Text;
    time : Text;
  };

  public type EmergencyContact = {
    name : Text;
    relationship : Text;
    phoneNumber : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let healthData = Map.empty<Principal, HealthData>();
  let emergencyContacts = Map.empty<Principal, [EmergencyContact]>();

  // Authorization mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Health Data Functions
  public shared ({ caller }) func logHealthData(data : HealthData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log health data");
    };
    healthData.add(caller, data);
  };

  public query ({ caller }) func getHealthData(user : Principal) : async HealthData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view health data");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own health data");
    };
    switch (healthData.get(user)) {
      case (null) { Runtime.trap("Health data not found") };
      case (?data) { data };
    };
  };

  // Emergency Contact Functions
  public shared ({ caller }) func addEmergencyContact(contact : EmergencyContact) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add emergency contacts");
    };
    let existingContacts = switch (emergencyContacts.get(caller)) {
      case (null) { [] };
      case (?contacts) { contacts };
    };
    let newContacts = existingContacts.concat([contact]);
    emergencyContacts.add(caller, newContacts);
  };

  public query ({ caller }) func getEmergencyContacts(user : Principal) : async [EmergencyContact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view emergency contacts");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own emergency contacts");
    };
    switch (emergencyContacts.get(user)) {
      case (null) { Runtime.trap("No emergency contacts found") };
      case (?contacts) { contacts };
    };
  };
};
