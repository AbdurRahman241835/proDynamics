"use client";

import { useCallback, useEffect, useState } from "react";

type StudentsForm = {
  id: number | null;
  name: string;
  subjectId: number | null;
  grade: number | null;
};

type Students = {
  id: number;
  name: string;
  grade: number;
  subjectId : number | null
  remarks: string;
  subject :{

    name : string
  }
  
};

type Subject = {
  id: number | null;
  name: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [form, setForm] = useState<{
    id: number | null;
    name: string;
    subjectId: number | null;
    grade: number | null;
  }>({
    id: null,
    name: "",
    subjectId: null,
    grade: null,
  });
  const [editing, setEditing] = useState(false);

  // Fetch students + subjects
  const fetchStudents = useCallback(async () => {
    const res = await fetch(`/api/student?search=${search}&filter=${filter}`);
    const data = await res.json();
    setStudents(data);
  }, [search, filter]); // dependencies

  const fetchSubjects = useCallback(async () => {
    const res = await fetch("/api/subject");
    const data = await res.json();
    setSubjects(data);
  }, []);

    useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, [fetchStudents, fetchSubjects]);

  // Add or Update student
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";
    await fetch("/api/student", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id,
        name: form.name,
        subjectId: Number(form.subjectId),
        grade: Number(form.grade),
      }),
    });

    setForm({ id: null, name: "", subjectId: null, grade: null });
    setEditing(false);
    fetchStudents();
  }

  // Edit handler
  function handleEdit(student: StudentsForm) {
    setForm({
      id: student.id,
      name: student.name,
      subjectId: student.subjectId,
      grade: student.grade,
    });
    setEditing(true);
  }

  // Delete handler
  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this student?")) {
      await fetch("/api/student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchStudents();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🎓 Student Grades System
      </h1>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="py-2.5 sm:py-3 px-4 block w-full border border-gray-400 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="Search students here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-3 px-4 pe-9 block border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          <option value="ALL">All</option>
          <option value="PASS">Pass</option>
          <option value="FAIL">Fail</option>
        </select>
      </div>

      {/* Add/Edit Student Form */}
      <form
        onSubmit={handleSubmit}
        className="border p-4 mb-4 rounded bg-gray-50"
      >
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            className="py-2.5 sm:py-3 px-4 block w-full border border-gray-400 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Student Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.subjectId === null ? "" : form.subjectId}
            required
            onChange={(e) =>
              setForm({ ...form, subjectId: Number(e.target.value) })
            }
            className="py-3 px-4 pe-9 block w-full border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="">Select Subject</option>
            {subjects.map((s: Subject) => (
              <option key={s.id} value={s.id === null ? "" : s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Grade"
            value={form.grade === null ? "" : form.grade}
            onChange={(e) =>
              setForm({ ...form, grade: Number(e.target.value) })
            }
            className="py-2.5 sm:py-3 px-4 block w-full border border-gray-400 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-sm text-white px-4 py-2 mt-3 rounded"
        >
          {editing ? "Update Student" : "Add Student"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={() => {
              setForm({ id: null, name: "", subjectId: null, grade: null });
              setEditing(false);
            }}
            className="ml-2 text-sm bg-gray-400 text-white px-4 py-2 mt-3 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Student Table */}

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-centertext-xs font-medium text-gray-500 uppercase"
                    >
                      Grade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Remarks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((s: Students) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4  whitespace-nowrap text-sm font-medium text-gray-800">
                        {s.name}
                      </td>
                      <td className="px-6 py-4   text-center whitespace-nowrap text-sm text-gray-800">
                        {s.subject?.name}
                      </td>
                      <td className="px-6 py-4  text-center whitespace-nowrap text-sm  text-gray-800">
                        {s.grade}
                      </td>
                      <td
                        className={`px-6 py-4  whitespace-nowrap text-center  text-gray-800`}
                      >
                        <span
                          className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full font-semibold  text-xs ${
                            s.remarks === "PASS" ? "bg-teal-500" : "bg-red-400"
                          }  text-white`}
                        >
                          {s.remarks}
                        </span>
                      </td>
                      <td className="px-6 py-4  whitespace-nowrap  text-center  text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          className="inline-flex p-2 bg-amber-400 mr-2 items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:text-gray-500 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="inline-flex p-2 bg-red-500 items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:text-gray-600 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
