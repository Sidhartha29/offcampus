import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { BookOpen, Plus, Upload, ClipboardList, AlertTriangle } from 'lucide-react';

const initialFormState = {
  title: '',
  description: '',
  course: '',
  dueDate: '',
  maxMarks: 100,
  assignedTo: []
};

function Assignments({ user, onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [mentees, setMentees] = useState([]);
  const [submissionUrls, setSubmissionUrls] = useState({});
  const [gradingInputs, setGradingInputs] = useState({});

  useEffect(() => {
    fetchAssignments();
    if (user?.role === 'mentor') {
      fetchMentees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignment');
      setAssignments(response.data.assignments || []);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentees = async () => {
    try {
      const response = await api.get('/mentor/my-mentees');
      setMentees(response.data.mentees || []);
    } catch (error) {
      toast.error('Unable to fetch mentees');
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const toggleStudentSelection = (studentId) => {
    setFormData((prev) => {
      const exists = prev.assignedTo.includes(studentId);
      return {
        ...prev,
        assignedTo: exists
          ? prev.assignedTo.filter((id) => id !== studentId)
          : [...prev.assignedTo, studentId]
      };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (user?.role !== 'mentor') {
      toast.error('Only mentors can create assignments');
      return;
    }

    try {
      await api.post('/assignment', {
        ...formData,
        maxMarks: Number(formData.maxMarks) || 100
      });
      toast.success('Assignment created successfully!');
      setShowForm(false);
      resetForm();
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleSubmit = async (assignmentId) => {
    const fileUrl = submissionUrls[assignmentId];
    if (!fileUrl) {
      toast.error('Please provide a file URL');
      return;
    }

    try {
      await api.post(`/assignment/${assignmentId}/submit`, { fileUrl });
      toast.success('Assignment submitted successfully!');
      setSubmissionUrls((prev) => ({ ...prev, [assignmentId]: '' }));
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    }
  };

  const handleGrade = async (assignmentId, submissionId, marks, feedback) => {
    if (marks === undefined || marks === null || marks === '') {
      toast.error('Please provide marks before grading');
      return;
    }

    try {
      await api.patch(`/assignment/${assignmentId}/grade/${submissionId}`, {
        marks,
        feedback
      });
      toast.success('Assignment graded successfully!');
      setGradingInputs((prev) => {
        const key = `${assignmentId}-${submissionId}`;
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to grade assignment');
    }
  };

  const myAssignments = useMemo(() => assignments || [], [assignments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Assignments</h1>
            <p className="text-white/80">
              {user?.role === 'mentor'
                ? 'Create personalised tasks and review submissions'
                : 'Manage your coursework and track mentor feedback'}
            </p>
          </div>
          {user?.role === 'mentor' && (
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>{showForm ? 'Close' : 'New Assignment'}</span>
            </button>
          )}
        </div>

        {showForm && user?.role === 'mentor' && (
          <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Assignment</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <input
                    type="text"
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {mentees.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Specific Students (optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {mentees.map((student) => (
                      <label key={student._id} className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded text-purple-600 focus:ring-purple-500"
                          checked={formData.assignedTo.includes(student._id)}
                          onChange={() => toggleStudentSelection(student._id)}
                        />
                        <span className="truncate">
                          {student.name}
                          <span className="text-gray-400"> ({student.userId})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Leave empty to assign this task to all students.</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border border-dashed border-purple-300 rounded-lg bg-purple-50 text-sm text-purple-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>No mentees available. Assign students to target this task.</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all"
                >
                  Create Assignment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : myAssignments.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Assignments</h3>
            <p className="text-gray-600">No assignments available yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myAssignments.map((assignment) => {
              const mySubmission = user?.role === 'student'
                ? assignment.submissions?.find((s) => s.student?.userId === user?.userId)
                : null;
              const isPastDue = new Date(assignment.dueDate) < new Date();

              return (
                <div key={assignment._id} className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                        {isPastDue && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Past Due</span>
                        )}
                      </div>
                      {assignment.description && (
                        <p className="text-gray-600 mb-3 whitespace-pre-line">{assignment.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold">Course: {assignment.course}</span>
                        <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                        <span>Max Marks: {assignment.maxMarks}</span>
                      </div>
                      {user?.role === 'mentor' && (
                        <div className="mt-3 text-xs text-gray-500">
                          {Array.isArray(assignment.assignedTo) && assignment.assignedTo.length > 0 ? (
                            <span>
                              Assigned to: {assignment.assignedTo.map((student) => (
                                typeof student === 'string' ? student : student?.name || student?.userId
                              )).join(', ')}
                            </span>
                          ) : (
                            <span>Assigned to all students</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {user?.role === 'student' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      {mySubmission ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Your Submission</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="font-semibold break-all">{mySubmission.fileUrl}</p>
                              <p className="text-xs text-gray-500">
                                Submitted: {new Date(mySubmission.submittedAt).toLocaleString()}
                              </p>
                              {mySubmission.status === 'graded' && (
                                <p className="text-sm text-green-600 font-semibold mt-1">
                                  Marks: {mySubmission.marks}/{assignment.maxMarks}
                                </p>
                              )}
                              {mySubmission.feedback && (
                                <p className="text-sm text-gray-700 mt-1">
                                  Feedback: {mySubmission.feedback}
                                </p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              mySubmission.status === 'graded' ? 'bg-green-100 text-green-700' :
                              mySubmission.status === 'late' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {mySubmission.status}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">Submit Assignment</label>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                            <input
                              type="text"
                              placeholder="Enter file URL"
                              value={submissionUrls[assignment._id] || ''}
                              onChange={(e) =>
                                setSubmissionUrls((prev) => ({ ...prev, [assignment._id]: e.target.value }))
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              onClick={() => handleSubmit(assignment._id)}
                              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all flex items-center space-x-2"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Submit</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {user?.role === 'mentor' && assignment.submissions && assignment.submissions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-purple-600" />
                        Submissions ({assignment.submissions.length})
                      </h4>
                      <div className="space-y-3">
                        {assignment.submissions.map((submission) => {
                          const key = `${assignment._id}-${submission._id}`;
                          const gradingState = gradingInputs[key] || {};

                          return (
                            <div key={submission._id} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-gray-800">{submission.student?.name || 'Unknown student'}</p>
                                  <p className="text-sm text-gray-600 break-all">{submission.fileUrl}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(submission.submittedAt).toLocaleString()}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  submission.status === 'graded' ? 'bg-green-100 text-green-700' :
                                  submission.status === 'late' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {submission.status}
                                </span>
                              </div>

                              {submission.status !== 'graded' ? (
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                                  <input
                                    type="number"
                                    placeholder="Marks"
                                    value={gradingState.marks || ''}
                                    max={assignment.maxMarks}
                                    min={0}
                                    onChange={(e) =>
                                      setGradingInputs((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...gradingState,
                                          marks: e.target.value
                                        }
                                      }))
                                    }
                                    className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Feedback (optional)"
                                    value={gradingState.feedback || ''}
                                    onChange={(e) =>
                                      setGradingInputs((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...gradingState,
                                          feedback: e.target.value
                                        }
                                      }))
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                  <button
                                    onClick={() =>
                                      handleGrade(
                                        assignment._id,
                                        submission._id,
                                        gradingState.marks,
                                        gradingState.feedback
                                      )
                                    }
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                                  >
                                    Grade
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-3 text-sm text-gray-700 space-y-1">
                                  <p>
                                    <span className="font-semibold">Marks:</span> {submission.marks}/{assignment.maxMarks}
                                  </p>
                                  {submission.feedback && (
                                    <p>
                                      <span className="font-semibold">Feedback:</span> {submission.feedback}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;

