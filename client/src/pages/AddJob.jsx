import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const {backendUrl,companyToken} = useContext(AppContext);

  const onSubmitHandler = async (e) => {
     e.preventDefault();

     try{
       const description = quillRef.current.root.innerHTML;
       const {data} = await axios.post(`${backendUrl}/api/company/post-job`, 
          {title, description, category, location, level, salary},
          {headers:{token: companyToken}}
       )
       if(data.success){
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
       }
       else{
        toast.error(data.message);
       }
      }catch(err){
        toast.error(error.message);
      }

    
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form  onSubmit = {onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
      {/* Job Title */}
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      {/* Job Description */}
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef} className="bg-white h-40 border border-gray-300" />
      </div>

      {/* Category, Location, Level */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        {/* Category */}
        <div>
          <p className="mb-2">Job Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <p className="mb-2">Job Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <p className="mb-2">Job Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div className="mb-2">
        <p className="mb-2">Job Salary</p>
        <input
          min = {0}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          onChange={(e) => setSalary(e.target.value)}
          type="number"
          placeholder="25000"
          value={salary}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        ADD
      </button>
    </form>
  );
};

export default AddJob;
