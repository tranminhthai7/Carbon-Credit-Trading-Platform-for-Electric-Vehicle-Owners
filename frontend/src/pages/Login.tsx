import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../auth/AuthContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { loginAs } = useAuth();
	const navigate = useNavigate();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Placeholder for real auth call
		alert(`Login with ${email}`);
	};

	const quickLogin = (role: Exclude<Role, null>) => {
		loginAs(role);
		switch (role) {
			case 'EV_OWNER':
				navigate('/owner');
				break;
			case 'BUYER':
				navigate('/buyer');
				break;
			case 'CVA':
				navigate('/cva');
				break;
			case 'ADMIN':
				navigate('/admin');
				break;
		}
	};

	return (
		<div style={{ maxWidth: 480 }}>
			<h2>Đăng nhập</h2>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
				<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input placeholder="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Đăng nhập</button>
			</form>

			<div style={{ marginTop: 24 }}>
				<h3>Đăng nhập nhanh theo vai trò (mock)</h3>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
					<button onClick={() => quickLogin('EV_OWNER')}>EV Owner</button>
					<button onClick={() => quickLogin('BUYER')}>Buyer</button>
					<button onClick={() => quickLogin('CVA')}>CVA</button>
					<button onClick={() => quickLogin('ADMIN')}>Admin</button>
				</div>
				<p style={{ color: '#666', marginTop: 8 }}>
					Sau này sẽ gọi API Gateway để xác thực thực tế và điều hướng theo role.
				</p>
			</div>
		</div>
	);
}


