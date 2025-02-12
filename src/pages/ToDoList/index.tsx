import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Typography, Modal, Input,} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SnippetsOutlined } from '@ant-design/icons';
import './index.css'
const { Title, Text } = Typography;

const colorOptions = [
	{ label: 'Xanh', value: '#3f87f5' },
	{ label: 'Vàng', value: '#f5c242' },
	{ label: 'Xanh lá', value: '#42c85c' },
	{ label: 'Đỏ', value: '#f54242' },
	{ label: 'Cam', value: '#ff8c00' },
	{ label: 'Tím', value: '#a64dff' },
];
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colorOptions.length);
    return colorOptions[randomIndex].value;
};
const ToDoList = () => {
	const getStoredTasks = () => {
		const savedTasks = localStorage.getItem('tasks');
		return savedTasks ? JSON.parse(savedTasks) : [];
	};

	const [tasks, setTasks] = useState(getStoredTasks());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newTask, setNewTask] = useState({ title: '', description: '', color: '#3f87f5' });
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

	useEffect(() => {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}, [tasks]);

	const openModalForNewTask = () => {
		setNewTask({ title: '', description: '', color: '#3f87f5' });
		setEditingTaskId(null);
		setIsModalOpen(true);
	};

	const openModalForEditTask = (taskId: number) => {
		const taskToEdit = tasks.find((task: { id: number; }) => task.id === taskId);
		if (taskToEdit) {
			setNewTask(taskToEdit);
			setEditingTaskId(taskId);
			setIsModalOpen(true);
		}
	};

	const saveTask = () => {
		if (!newTask.title.trim() || !newTask.description.trim()) return;

		if (editingTaskId !== null) {
			const updatedTasks = tasks.map((task: { id: number; }) =>
				task.id === editingTaskId ? { ...task, ...newTask } : task
			);
			setTasks(updatedTasks);
		} else {
			const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
			const updatedTasks = [...tasks, { id: newId, ...newTask, color: getRandomColor() }];
			setTasks(updatedTasks);
		}

		setIsModalOpen(false);
		setNewTask({ title: '', description: '', color: '#3f87f5' });
		setEditingTaskId(null);
	};
const deleteTask = (id: number) => {
		const updatedTasks = tasks.filter((task: { id: number; }) => task.id !== id);
		setTasks(updatedTasks);
	};

	return (
		<div style={{ width: '100%', height: '1000px', textAlign: 'center', backgroundColor:"aliceblue",}}>
			<div style={{ width: '100%', padding: '20px' }}>
				<Title level={2}>Todo List</Title>
				<Button
					className="CreateTask"
					type='primary'
					icon={<PlusOutlined />}
					onClick={openModalForNewTask}
					style={{
						marginBottom: '10px',
						backgroundColor: 'blue',
						
						borderRadius: '10px',
						border: '2px solid transparent',
					}}
					
				>
					CREATE TASK
				</Button>
			</div>
<div 
style = {{
	backgroundColor:"#f0f0f0",
	padding:"10px",
	height:"100%",
}}>
			<Title level={4} style={{ textAlign: 'left', margin: '20px 0' }}>All Tasks</Title>

			<Row gutter={[16, 16]}>
				{(tasks ?? []).map((task) => (
					<Col xs={24} sm={12} md={8} lg={6} key={task.id}>
						<Card
							
							bordered={true}
							style={{
								borderTop: `4px solid ${task.color}`,
								borderRadius: '8px',
								textAlign: 'left',
								minHeight: '180px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}
							actions={[
								<EditOutlined key='edit'  style={{ color: task.color }} onClick={() => openModalForEditTask(task.id)} />,
								<DeleteOutlined key='delete' style={{ color: task.color }} onClick={() => deleteTask(task.id)} />,
							]}
						>
							<div
								style={{
									marginBottom: '10px',
									fontWeight: 'bold',
									background: `${task.color}20`,
									padding: '5px',
									borderRadius: '4px',
									display: 'inline-block',
								}}
							>
								{task.title}
							</div><br></br>
							<Text style={{ whiteSpace: 'pre-line' }}>{task.description}</Text>
						</Card>
					</Col>
				))}
			</Row>

			<Modal
				title={editingTaskId !== null ? 'Edit Task' : 'Create Task'}
				visible={isModalOpen}
				onOk={saveTask}
				onCancel={() => setIsModalOpen(false)}
			>
				<b>Title</b>
				<Input
					placeholder='Title'
					value={newTask.title}
					onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
					style={{ marginBottom: '10px' }}
				/>
				<b>Description</b>
				<Input.TextArea
					placeholder='Description'
					value={newTask.description}
					onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
					style={{ marginBottom: '10px' }}
				/>

			</Modal>
		</div>
		</div>
	);
};

export default ToDoList;