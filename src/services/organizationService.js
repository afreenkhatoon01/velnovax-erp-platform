
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// Get the current user's organization ID
export async function getOrganizationId(uid) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error(
      "User profile not found. Please complete organization setup."
    );
  }

  const organizationId = userSnapshot.data().organizationId;

  if (!organizationId) {
    throw new Error(
      "Organization not found. Please complete organization setup."
    );
  }

  return organizationId;
}

// Read records from the current organization's collection
export async function getOrganizationRecords(uid, collectionName) {
  const organizationId = await getOrganizationId(uid);

  const recordsRef = collection(
    db,
    "organizations",
    organizationId,
    collectionName
  );

  const snapshot = await getDocs(recordsRef);

  return snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  }));
}

// Create a new record
export async function createOrganizationRecord(
  uid,
  collectionName,
  data
) {
  const organizationId = await getOrganizationId(uid);

  const recordsRef = collection(
    db,
    "organizations",
    organizationId,
    collectionName
  );

  const recordRef = await addDoc(recordsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return recordRef.id;
}

// Update an existing record
export async function updateOrganizationRecord(
  uid,
  collectionName,
  recordId,
  changes
) {
  const organizationId = await getOrganizationId(uid);

  const recordRef = doc(
    db,
    "organizations",
    organizationId,
    collectionName,
    recordId
  );

  await updateDoc(recordRef, {
    ...changes,
    updatedAt: serverTimestamp(),
  });
}

// Delete an existing record
export async function deleteOrganizationRecord(
  uid,
  collectionName,
  recordId
) {
  const organizationId = await getOrganizationId(uid);

  const recordRef = doc(
    db,
    "organizations",
    organizationId,
    collectionName,
    recordId
  );

  await deleteDoc(recordRef);
}
