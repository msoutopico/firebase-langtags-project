# https://firebase.google.com/docs/admin/setup/
 
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate(
    "../auth/langtags-fd750-firebase-adminsdk-swfpm-4271db3aad.json"
)
app = firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()


# config = {
#     "apiKey": "AIzaSyCYRjD0cwbG3k650S7ZBDL2PuHW7Dd6acA",
#     "authDomain": "langtags-fd750.firebaseapp.com",
#     "databaseURL": "https://langtags-fd750-default-rtdb.europe-west1.firebasedatabase.app",
#     "projectId": "langtags-fd750",
#     "storageBucket": "langtags-fd750.appspot.com",
#     "messagingSenderId": "677494757687",
#     "appId": "1:677494757687:web:6acc0e4905986c156162b2",
#     "measurementId": "G-VG3Y8VVCY7",
#     "serviceAccount": "../auth/langtags-fd750-firebase-adminsdk-swfpm-4271db3aad.json",
# }

# Reference to the Firestore collection
collection_ref = db.collection("guides")

doc_ref = db.collection("guides").document("Abraham")
doc_ref.set({"title": "La angustia de Abraham", "content": "Sobre los orígenes culturales del islam"})

doc_ref2 = db.collection("guides").document("arabes")
doc_ref2.set({"title": "Cuando fuimos árabes", "content": "Biografía intelectual de Emilio Gonzalez Ferrin"})

doc_ref3 = db.collection("guides").document()
doc_ref3.set({"title": "Sherlock Holmes", "content": "delectivesco"})

# Get all documents in the collection
docs = collection_ref.stream()

# Iterate through the documents
for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")

# Secure your data (adding rules to firestore.ruules)
# https://firebase.google.com/docs/firestore/quickstart#python
# https://firebase.google.com/docs/firestore/quickstart#secure_your_data