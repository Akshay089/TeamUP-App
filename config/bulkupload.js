import { collection, doc, setDoc } from 'firebase/firestore';
import { slots } from './../store/turfs';
import { db } from "./firebaseConfig";

const turfData=slots

const uploadData=async()=>{
    try{
        for (let i = 0; i < turfData.length; i++) {
            const turf=turfData[i];
            const docRef = doc(collection(db, "slots"), `slots_${i + 1}`);
            await setDoc(docRef,turf);
        }
        console.log("Data Uploaded!!!");
    }
    catch(e){
        console.log("Error while uploading data",e);
    }
};

export default uploadData;