import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Profile.css';

/* ─── API helpers ────────────────────────────────────────────────────────── */
const fetchProfile = async (host) => {
    const res = await fetch(`${host}/api/profile/student`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth_token')
        }
    });
    return res.json();
};

const updateProfile = async (host, payload) => {
    const res = await fetch(`${host}/api/profile/student/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth_token')
        },
        body: JSON.stringify(payload)
    });
    return res.json();
};

/* ─── Editable field ─────────────────────────────────────────────────────── */
function Field({ icon, label, value, name, editMode, onChange, type = 'text', darkClass }) {
    return (
        <div className="profile-field">
            <div className={`profile-field-icon ${darkClass}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div className="profile-field-content">
                <p className="profile-field-label">{label}</p>
                {editMode ? (
                    <input
                        className={`profile-field-input ${darkClass}`}
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                    />
                ) : (
                    <p className={`profile-field-value ${darkClass ? 'dark-text' : ''}`}>
                        {value || <span style={{ color: '#b0b0b0' }}>Not set</span>}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
function Profile(props) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { msg, type }

    const darkClass = props.toggleMode === 'dark' ? 'dark' : '';

    /* search bar refs (same pattern as Dashboard / Editor) */
    const welcome = useRef(null);
    const search = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (search.current?.parentElement && !search.current.parentElement.contains(event.target)) {
            welcome.current?.classList.remove('openSearch');
            search.current?.classList.remove('openSearch');
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const openSearchOpt = () => {
        welcome.current?.classList.add('openSearch');
        search.current?.classList.add('openSearch');
        document.addEventListener('mousedown', handleClickOutside);
    };

    /* load profile */
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProfile(props.host);
                if (data && data.Name) {
                    setProfile(data);
                    // pre-fill form
                    const sh = data.Social_Handles || [];
                    const getHandle = (name) => sh.find(h => h.handle_name === name)?.handle_link || '';
                    setForm({
                        name: data.Name || '',
                        phone: data.Phone || '',
                        dob: data.DOB ? data.DOB.split('T')[0] : '',
                        street: data.Address?.street || '',
                        city: data.Address?.city || '',
                        state: data.Address?.state || '',
                        country: data.Address?.country || '',
                        pin: data.Address?.pin || '',
                        university_type: data.Education?.university_type || '',
                        school_clg_name: data.Education?.school_clg_name || '',
                        class_year: data.Education?.class_year || '',
                        linkedin: getHandle('linkedin'),
                        hacker_rank: getHandle('hacker_rank'),
                        codechef: getHandle('codechef'),
                        instagram: getHandle('instagram'),
                    });
                } else {
                    setError(data?.msg || 'Failed to load profile.');
                }
            } catch {
                setError('Could not reach the server.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [props.host]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await updateProfile(props.host, form);
            if (res.success) {
                // refresh profile
                const fresh = await fetchProfile(props.host);
                setProfile(fresh);
                setEditMode(false);
                showToast('Profile updated successfully!', 'success');
            } else {
                showToast(res.msg || 'Update failed.', 'error');
            }
        } catch {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        // reset form to current profile
        if (profile) {
            const sh = profile.Social_Handles || [];
            const getHandle = (name) => sh.find(h => h.handle_name === name)?.handle_link || '';
            setForm({
                name: profile.Name || '',
                phone: profile.Phone || '',
                dob: profile.DOB ? profile.DOB.split('T')[0] : '',
                street: profile.Address?.street || '',
                city: profile.Address?.city || '',
                state: profile.Address?.state || '',
                country: profile.Address?.country || '',
                pin: profile.Address?.pin || '',
                university_type: profile.Education?.university_type || '',
                school_clg_name: profile.Education?.school_clg_name || '',
                class_year: profile.Education?.class_year || '',
                linkedin: getHandle('linkedin'),
                hacker_rank: getHandle('hacker_rank'),
                codechef: getHandle('codechef'),
                instagram: getHandle('instagram'),
            });
        }
    };

    /* helpers for display */
    const getHandle = (name) =>
        (profile?.Social_Handles || []).find(h => h.handle_name === name)?.handle_link || '';

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    /* ── Render: loading ── */
    if (loading) return (
        <div className="profileContainer">
            <div className="profile-loading">
                <div className="profile-loading-spinner"></div>
                <p style={{ color: '#696984' }}>Loading profile…</p>
            </div>
        </div>
    );

    /* ── Render: error ── */
    if (error) return (
        <div className="profileContainer">
            <div className="profile-loading">
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 36, color: '#cc2222' }}></i>
                <p className="profile-error-msg">{error}</p>
            </div>
        </div>
    );

    /* ── Render: main ── */
    return (
        <>
            <div className="profileContainer">
                {/* ── Top heading bar (same as Dashboard) ── */}
                <div className="profile-board-heading board-heading">
                    <div className="welcome-text d-flex flex-row">
                        <div className="menu-icon" onClick={props.controlNav}>
                            <i className="fa-solid fa-list-ul"></i>
                        </div>
                        <div ref={welcome} className="d-flex flex-column welcome-effect">
                            <h1>My Profile</h1>
                            <p>Manage your account details</p>
                        </div>
                    </div>
                    <div className="search-notify-box">
                        <div className={`search-bar ${props.toggleMode}`}>
                            <i className="fa-solid fa-magnifying-glass" onClick={openSearchOpt}></i>
                            <input
                                ref={search}
                                type="text"
                                name="search"
                                id="profile-search"
                                className={props.toggleMode}
                                placeholder="Search"
                            />
                        </div>
                        <div className="notify-box">
                            <span className="notify-count">5</span>
                            <ion-icon name="notifications"></ion-icon>
                        </div>
                    </div>
                </div>

                {/* ── Hero Banner ── */}
                <div className="profile-hero">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        {editMode && (
                            <div className="profile-avatar-badge" title="Change photo">
                                <i className="fa-solid fa-camera"></i>
                            </div>
                        )}
                    </div>

                    <div className="profile-hero-info">
                        <h1>{editMode ? form.name : profile.Name}</h1>
                        <p className="profile-email">{profile.Email}</p>
                        <div className="profile-hero-tags">
                            <span className="profile-tag">
                                <i className="fa-solid fa-graduation-cap" style={{ marginRight: 5 }}></i>
                                Student
                            </span>
                            {profile.Education?.university_type && (
                                <span className="profile-tag">
                                    <i className="fa-solid fa-school" style={{ marginRight: 5 }}></i>
                                    {profile.Education.university_type}
                                </span>
                            )}
                            {profile.Address?.city && (
                                <span className="profile-tag">
                                    <i className="fa-solid fa-location-dot" style={{ marginRight: 5 }}></i>
                                    {profile.Address.city}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="profile-hero-stats">
                        <div className="profile-hero-stat">
                            <h3>0</h3>
                            <p>Courses</p>
                        </div>
                        <div className="profile-hero-stat">
                            <h3>0</h3>
                            <p>Tests</p>
                        </div>
                        <div className="profile-hero-stat">
                            <h3>0</h3>
                            <p>Badges</p>
                        </div>
                    </div>

                    <button className="profile-edit-btn" onClick={() => editMode ? handleCancel() : setEditMode(true)}>
                        <i className={`fa-solid ${editMode ? 'fa-xmark' : 'fa-pen'}`}></i>
                        {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {/* ── Stats strip ── */}
                <div className={`profile-card profile-grid-full ${darkClass}`} style={{ marginBottom: '1.5rem' }}>
                    <div className="profile-stats-strip">
                        <div className={`profile-stat-box ${darkClass}`}>
                            <h3>0</h3>
                            <p>Tests Written</p>
                        </div>
                        <div className={`profile-stat-box ${darkClass}`}>
                            <h3>0%</h3>
                            <p>Overall Average</p>
                        </div>
                        <div className={`profile-stat-box ${darkClass}`}>
                            <h3>0</h3>
                            <p>Badges Earned</p>
                        </div>
                        <div className={`profile-stat-box ${darkClass}`}>
                            <h3>0</h3>
                            <p>Certificates</p>
                        </div>
                        <div className={`profile-stat-box ${darkClass}`}>
                            <h3>0</h3>
                            <p>Day Streak</p>
                        </div>
                    </div>
                </div>

                {/* ── Two-column grid ── */}
                <div className="profile-grid">

                    {/* Personal Information */}
                    <div className={`profile-card ${darkClass}`}>
                        <h3 className="profile-card-title">
                            <i className="fa-solid fa-circle-user"></i>
                            Personal Information
                        </h3>
                        <Field icon="fa-user" label="Full Name" name="name"
                            value={editMode ? form.name : profile.Name}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-phone" label="Phone Number" name="phone"
                            value={editMode ? form.phone : profile.Phone}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-cake-candles" label="Date of Birth" name="dob"
                            type="date"
                            value={editMode ? form.dob : formatDate(profile.DOB)}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-envelope" label="Email Address" name="email"
                            value={profile.Email}
                            editMode={false} onChange={() => {}} darkClass={darkClass} />
                    </div>

                    {/* Address */}
                    <div className={`profile-card ${darkClass}`}>
                        <h3 className="profile-card-title">
                            <i className="fa-solid fa-location-dot"></i>
                            Address
                        </h3>
                        <Field icon="fa-road" label="Street" name="street"
                            value={editMode ? form.street : profile.Address?.street}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-city" label="City" name="city"
                            value={editMode ? form.city : profile.Address?.city}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-map" label="State" name="state"
                            value={editMode ? form.state : profile.Address?.state}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-flag" label="Country" name="country"
                            value={editMode ? form.country : profile.Address?.country}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                        <Field icon="fa-hashtag" label="PIN Code" name="pin"
                            value={editMode ? form.pin : profile.Address?.pin}
                            editMode={editMode} onChange={handleChange} darkClass={darkClass} />
                    </div>

                    {/* Education */}
                    <div className={`profile-card ${darkClass}`}>
                        <h3 className="profile-card-title">
                            <i className="fa-solid fa-graduation-cap"></i>
                            Education
                        </h3>
                        {editMode ? (
                            <>
                                <div className="profile-field">
                                    <div className={`profile-field-icon ${darkClass}`}>
                                        <i className="fa-solid fa-school"></i>
                                    </div>
                                    <div className="profile-field-content">
                                        <p className="profile-field-label">Institution Type</p>
                                        <select
                                            name="university_type"
                                            value={form.university_type}
                                            onChange={handleChange}
                                            className={`profile-field-input ${darkClass}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <option value="">Select type</option>
                                            <option value="School">School</option>
                                            <option value="College">College</option>
                                        </select>
                                    </div>
                                </div>
                                <Field icon="fa-building-columns" label="School / College Name" name="school_clg_name"
                                    value={form.school_clg_name}
                                    editMode={true} onChange={handleChange} darkClass={darkClass} />
                                <Field icon="fa-layer-group" label="Class / Year" name="class_year"
                                    type="number"
                                    value={form.class_year}
                                    editMode={true} onChange={handleChange} darkClass={darkClass} />
                            </>
                        ) : (
                            profile.Education?.school_clg_name ? (
                                <div className="profile-edu-row">
                                    <div className="profile-edu-icon">
                                        <i className="fa-solid fa-building-columns"></i>
                                    </div>
                                    <div className="profile-edu-details">
                                        <h4>{profile.Education.school_clg_name}</h4>
                                        <p>
                                            {profile.Education.university_type}
                                            {profile.Education.class_year ? ` · Class / Year ${profile.Education.class_year}` : ''}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: '#b0b0b0', fontSize: 13 }}>No education details added yet.</p>
                            )
                        )}
                    </div>

                    {/* Social Handles */}
                    <div className={`profile-card ${darkClass}`}>
                        <h3 className="profile-card-title">
                            <i className="fa-solid fa-share-nodes"></i>
                            Social Profiles
                        </h3>
                        {editMode ? (
                            <div className="profile-socials">
                                {[
                                    { name: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn URL', cls: 'linkedin' },
                                    { name: 'hacker_rank', icon: 'fa-brands fa-hackerrank', label: 'HackerRank URL', cls: 'hacker' },
                                    { name: 'codechef', icon: 'fa-solid fa-code', label: 'CodeChef URL', cls: 'codechef' },
                                    { name: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram URL', cls: 'instagram' },
                                ].map(s => (
                                    <div key={s.name} className="profile-field">
                                        <div className={`profile-social-icon ${s.cls}`}>
                                            <i className={s.icon}></i>
                                        </div>
                                        <div className="profile-field-content">
                                            <p className="profile-field-label">{s.label}</p>
                                            <input
                                                className={`profile-field-input ${darkClass}`}
                                                type="url"
                                                name={s.name}
                                                value={form[s.name] || ''}
                                                onChange={handleChange}
                                                placeholder="https://"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="profile-socials">
                                {[
                                    { key: 'linkedin', icon: 'fa-brands fa-linkedin', cls: 'linkedin', label: 'LinkedIn' },
                                    { key: 'hacker_rank', icon: 'fa-brands fa-hackerrank', cls: 'hacker', label: 'HackerRank' },
                                    { key: 'codechef', icon: 'fa-solid fa-code', cls: 'codechef', label: 'CodeChef' },
                                    { key: 'instagram', icon: 'fa-brands fa-instagram', cls: 'instagram', label: 'Instagram' },
                                ].map(s => (
                                    <div key={s.key} className="profile-social-row">
                                        <div className={`profile-social-icon ${s.cls}`}>
                                            <i className={s.icon}></i>
                                        </div>
                                        {getHandle(s.key) ? (
                                            <a
                                                href={getHandle(s.key)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="profile-social-link"
                                            >
                                                {getHandle(s.key)}
                                            </a>
                                        ) : (
                                            <span className="profile-social-empty">{s.label} not added</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Save / Cancel bar ── */}
                {editMode && (
                    <div className="profile-save-bar">
                        <button className="profile-cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Saving…</>
                            ) : (
                                <><i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }}></i>Save Changes</>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className={`profile-toast ${toast.type}`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`}
                        style={{ marginRight: 8 }}></i>
                    {toast.msg}
                </div>
            )}
        </>
    );
}

export default Profile;
