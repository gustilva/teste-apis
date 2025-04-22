import React, { useEffect, useState } from 'react';
import './kafka-monitor.css';

const KafkaMonitor = () => {
    const [messages, setMessages] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValue, setEditedValue] = useState('');

    const loadMessages = async () => {
        try {
            const response = await fetch('http://localhost:3000/kafka-monitor/getMessages');
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleEdit = (key, value) => {
        setEditingKey(key);
        setEditedValue(value);
    };

    const handleSave = async (key) => {
        try {
            await fetch('http://localhost:3000/kafka-monitor/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: 'test-topic', key, value: editedValue })
            });
            setEditingKey(null);
            loadMessages();
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const handleRemove = async (key) => {
        try {
            await fetch('http://localhost:3000/kafka-monitor/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: 'test-topic', key })
            });
            await loadMessages();
        } catch (error) {
            console.error('Error removing message:', error);
        }
    };

    return (
        <div className="App">
            <h1 style={{ backgroundColor: '#162b3f' }} className="title text-white text-center">Kafka Messages</h1>
            <table>
                <thead>
                <tr className="text-center">
                    <th className="text-center">Key</th>
                    <th className="text-center">Value</th>
                    <th className="text-center">Offset  (Message Id by Partition)</th>
                    <th className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((msg) => (
                    <tr key={msg.offset}>
                        <td>{msg.key}</td>
                        <td>
                            {editingKey === msg.key ? (
                                <textarea
                                    cols={100}
                                    rows={10}
                                    value={editedValue}
                                    onChange={(e) => setEditedValue(e.target.value)}
                                />
                            ) : (
                                <span>{<pre>{msg?.value?.replaceAll(',', '\n')} </pre>}</span>

                            )}
                        </td>
                        <td className="text-center">{msg.offset}</td>
                        <td className="text-center">
                            {editingKey === msg.key ? (
                                <button
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm mb-5 text-sm font-medium text-white bg-green bg-green-600 hover:bg-green-900  focus:outline-none focus:ring-2 focus:ring-offset-2"
                                    onClick={() => handleSave(msg.key)}>Save</button>
                            ) : (
                                <button
                                    className="mb-5 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                                    onClick={() => handleEdit(msg.key, msg.value)}>Edit</button>
                            )}
                            <button
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 "

                                onClick={() => handleRemove(msg.key)}>Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default KafkaMonitor;
