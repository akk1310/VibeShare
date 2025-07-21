import React from "react";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

function Search() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const search = (data) => {
    const query = data?.query;
    navigate(`/search/${query}`);
  };

  return (
    <>
      <form className="relative w-full" onSubmit={handleSubmit(search)}>
        <Input
          placeholder="Search"
          
          {...register("query", { required: true })}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <CiSearch size={22} />
        </button>
      </form>
    </>
  );
}

export default Search;
