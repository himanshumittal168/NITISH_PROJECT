import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api';

const UserForm = ({ onInputChange, formData }) => {
  return (
    <div className="mb-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">User Information</h2>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => onInputChange(formData.id, e.target.name, e.target.value)}
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => onInputChange(formData.id, e.target.name, e.target.value)}
            placeholder="Phone Number"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => onInputChange(formData.id, e.target.name, e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

const UserDirectory = () => {
  const [forms, setForms] = useState([{ id: 1, name: '', phone: '', email: '' }]);
  const [users, setUsers] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addMoreForms = () => {
    setForms([...forms, { id: forms.length + 1, name: '', phone: '', email: '' }]);
  };

  const handleInputChange = (id, field, value) => {
    setForms(forms.map(form => 
      form.id === id ? { ...form, [field]: value } : form
    ));
  };

  const handleSubmit = async () => {
    setSubmitStatus('Submitting...');
    console.log('Submitting forms:', forms);

    try {
      const newUsers = [];
      for (const form of forms) {
        if (!form.name || !form.phone || !form.email) {
          setSubmitStatus('Error: All fields must be filled');
          return;
        }

        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newUser = await response.json();
        newUsers.push(newUser);
      }

      setUsers(prevUsers => [...prevUsers, ...newUsers]);
      setForms([{ id: 1, name: '', phone: '', email: '' }]);
      setSubmitStatus('Submission successful!');
      console.log('Submission successful:', newUsers);
    } catch (error) {
      console.error('Error submitting users:', error);
      setSubmitStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Directory</h1>
      {forms.map((form) => (
        <UserForm 
          key={form.id} 
          onInputChange={handleInputChange} 
          formData={form}
        />
      ))}
      <div className="mt-4 space-x-2">
        <button 
          onClick={addMoreForms} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add More
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
      {submitStatus && <p className="mt-2 text-sm font-semibold">{submitStatus}</p>}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">User Directory</h2>
        <ul className="list-disc pl-5">
          {users.map((user, index) => (
            <li key={user._id || index}>
              {user.name} - {user.phone} - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDirectory;