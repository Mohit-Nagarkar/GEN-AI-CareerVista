import React, { useState, useRef } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as TextIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a7bd5',
    },
    secondary: {
      main: '#00d2ff',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const DishaGenRoadmap = () => {
  const [currentStep, setCurrentStep] = useState('topic-input');
  const [topic, setTopic] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [weakConcepts, setWeakConcepts] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('6-weeks');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const roadmapRef = useRef();

  const API_KEY = 'AIzaSyBRNWHx0CzbM2t58pdVsxpq0lkTZdHfZxM';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const generateQuiz = async (topic) => {
    setIsLoading(true);
    setError('');
    
    try {
      const prompt = `Generate a 5-question multiple-choice quiz about ${topic}. 
      For each question, provide:
      1. The question text
      2. Four options (a, b, c, d)
      3. The correct answer (a, b, c, or d)
      4. A concept tag that represents the knowledge area
      
      Format the response as a JSON array like this:
      [
        {
          "id": 1,
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "conceptTag": "Concept Name"
        }
      ]`;
      
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response (Gemini might add some text around the JSON)
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Could not parse quiz data from API response');
      }
      
      const quiz = JSON.parse(jsonMatch[0]);
      
      // Ensure each question has a proper ID
      const quizWithIds = quiz.map((q, index) => ({
        ...q,
        id: q.id || index + 1 // Use provided ID or generate one
      }));
      
      setQuizData(quizWithIds);
      setUserAnswers({}); // Reset previous answers
      setCurrentStep('quiz');
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Using sample data instead.');
      // Fallback to sample data
      setTimeout(() => {
        setQuizData(sampleQuiz['Python']);
        setUserAnswers({}); // Reset previous answers
        setCurrentStep('quiz');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmap = async (topic, score, weakConcepts) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Determine roadmap level based on score
      let roadmapLevel;
      if (score <= quizData.length * 0.3) {
        roadmapLevel = "Foundational";
      } else if (score <= quizData.length * 0.7) {
        roadmapLevel = "Intermediate";
      } else {
        roadmapLevel = "Advanced";
      }
      
      const weeks = timeCommitment === '6-weeks' ? 6 : 12;
      
      const prompt = `Create a personalized learning roadmap for ${topic} at ${roadmapLevel} level. 
      The user scored ${score} out of ${quizData.length} and needs help with: ${weakConcepts.join(', ')}.
      Create a ${weeks}-week roadmap with specific learning objectives and activities.
      
      Format the response as a JSON array of objects with this structure:
      [
        {
          "week": 1,
          "title": "Focus Area Title",
          "description": "Detailed description of what to learn this week",
          "concepts": ["Concept 1", "Concept 2"],
          "resources": ["Resource 1", "Resource 2"],
          "milestone": "What you should achieve by the end of the week"
        }
      ]
      
      IMPORTANT: Return only the JSON array, no additional text.`;
      
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Could not parse roadmap data from API response');
      }
      
      let roadmapSteps = JSON.parse(jsonMatch[0]);
      
      setRoadmap({
        topic,
        level: roadmapLevel,
        steps: roadmapSteps,
        weakConcepts,
        weeks
      });
      setCurrentStep('results');
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate roadmap. Using sample roadmap instead.');
      // Fallback to sample roadmap
      setTimeout(() => {
        const weeks = timeCommitment === '6-weeks' ? 6 : 12;
        const roadmapData = weeks === 6 
          ? sampleRoadmaps['Python']['Intermediate'] 
          : sampleExtendedRoadmaps['Python']['Intermediate'];
        
        setRoadmap({
          topic,
          level: "Intermediate",
          steps: roadmapData,
          weakConcepts,
          weeks
        });
        setCurrentStep('results');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSubmit = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      setTopic(customTopic);
      generateQuiz(customTopic);
    } else {
      setError('Please enter a topic');
    }
  };

  const handlePresetTopic = (presetTopic) => {
    setTopic(presetTopic);
    generateQuiz(presetTopic);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    const weakAreas = [];
    
    quizData.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      } else {
        weakAreas.push(question.conceptTag);
      }
    });
    
    setScore(correct);
    setWeakConcepts([...new Set(weakAreas)]);
    generateRoadmap(topic, correct, weakAreas);
  };

  const allQuestionsAnswered = () => {
    return quizData.length > 0 && 
           quizData.every(question => userAnswers[question.id] !== undefined);
  };

  const restartProcess = () => {
    setCurrentStep('topic-input');
    setTopic('');
    setCustomTopic('');
    setQuizData([]);
    setUserAnswers({});
    setScore(0);
    setWeakConcepts([]);
    setRoadmap(null);
    setError('');
  };

  // Download functionality
  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const downloadAsPDF = () => {
    handleDownloadClose();
    
    const input = roadmapRef.current;
    
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add more pages if the content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${topic}-Learning-Roadmap.pdf`);
    });
  };

  const downloadAsText = () => {
    handleDownloadClose();
    
    let textContent = `DishaGen+ Learning Roadmap for ${topic}\n`;
    textContent += `============================================\n\n`;
    textContent += `Skill Level: ${roadmap.level}\n`;
    textContent += `Score: ${score} out of ${quizData.length}\n\n`;
    
    if (weakConcepts.length > 0) {
      textContent += `Areas to focus on: ${weakConcepts.join(', ')}\n\n`;
    }
    
    textContent += `Roadmap (${roadmap.weeks} weeks):\n`;
    textContent += `----------------------------------------\n\n`;
    
    roadmap.steps.forEach((step) => {
      textContent += `Week ${step.week}: ${step.title}\n`;
      textContent += `Description: ${step.description}\n`;
      
      if (step.concepts && step.concepts.length > 0) {
        textContent += `Key Concepts: ${step.concepts.join(', ')}\n`;
      }
      
      if (step.milestone) {
        textContent += `Milestone: ${step.milestone}\n`;
      }
      
      textContent += `\n`;
    });
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic}-Learning-Roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sample data as fallback
  const sampleQuiz = {
    "Python": [
      {
        id: 1,
        question: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "define", "func"],
        correctAnswer: 1,
        conceptTag: "Functions"
      },
      {
        id: 2,
        question: "Which data type is mutable in Python?",
        options: ["tuple", "string", "list", "int"],
        correctAnswer: 2,
        conceptTag: "Data Types"
      }
    ]
  };

  const sampleRoadmaps = {
    "Python": {
      "Intermediate": [
        {
          week: 1,
          title: "Object-Oriented Programming Fundamentals",
          description: "Learn the core principles of OOP including classes, objects, inheritance, and polymorphism.",
          concepts: ["Classes", "Objects", "Inheritance", "Polymorphism"],
          resources: ["Python OOP Tutorial", "Real Python OOP Guide"],
          milestone: "Create a simple class hierarchy with inheritance"
        },
        {
          week: 2,
          title: "Error Handling and Exceptions",
          description: "Understand how to handle errors gracefully in Python using try-except blocks.",
          concepts: ["Try-Except", "Custom Exceptions", "Finally Block"],
          resources: ["Python Exceptions Tutorial", "Official Documentation"],
          milestone: "Implement robust error handling in a sample application"
        }
      ]
    }
  };

  const sampleExtendedRoadmaps = {
    "Python": {
      "Intermediate": [
        {
          week: 1,
          title: "Python Basics Review",
          description: "Solidify your understanding of Python fundamentals including data types, control structures, and functions.",
          concepts: ["Data Types", "Control Flow", "Functions"],
          resources: ["Python Basics Tutorial", "Practice Exercises"],
          milestone: "Complete 10 practice problems demonstrating core concepts"
        },
        {
          week: 2,
          title: "Object-Oriented Programming Fundamentals",
          description: "Learn the core principles of OOP including classes, objects, inheritance, and polymorphism.",
          concepts: ["Classes", "Objects", "Inheritance", "Polymorphism"],
          resources: ["Python OOP Tutorial", "Real Python OOP Guide"],
          milestone: "Create a simple class hierarchy with inheritance"
        }
      ]
    }
  };

  const getTimelineIcon = (index) => {
    const icons = [<LightbulbIcon />, <SchoolIcon />, <AssignmentIcon />, <CheckCircleIcon />, <PsychologyIcon />];
    return icons[index % icons.length];
  };

  const getTimelineColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    return colors[index % colors.length];
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" color="primary" gutterBottom>
                DishaGen+ Roadmap Module
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Personalized learning paths based on your skill assessment
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {currentStep === 'topic-input' && (
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  What would you like to learn?
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" paragraph>
                  Enter any topic you want to master, and we'll create a personalized learning path for you
                </Typography>
                
                <Box component="form" onSubmit={handleTopicSubmit} sx={{ mb: 4 }}>
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Enter any topic (e.g., Machine Learning, Web Development, Digital Marketing)"
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        fullWidth
                        sx={{ height: '56px' }}
                      >
                        Generate Learning Path
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormLabel component="legend">Time Commitment</FormLabel>
                  <RadioGroup
                    row
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(e.target.value)}
                    sx={{ justifyContent: 'center', mt: 1 }}
                  >
                    <FormControlLabel value="6-weeks" control={<Radio />} label="6 Weeks" />
                    <FormControlLabel value="12-weeks" control={<Radio />} label="12 Weeks" />
                  </RadioGroup>
                </Box>
                
                <Typography variant="h6" gutterBottom textAlign="center">
                  Or try one of these popular topics:
                </Typography>
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                  {['Python', 'React Development', 'Data Science', 'Digital Marketing'].map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      onClick={() => handlePresetTopic(topic)}
                      variant="outlined"
                      clickable
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {currentStep === 'quiz' && quizData.length > 0 && (
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  Skill Assessment: {topic}
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" paragraph>
                  Answer these questions to help us create your personalized roadmap
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {quizData.map((question, index) => (
                    <Card key={question.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Question {index + 1}: {question.question}
                        </Typography>
                        <RadioGroup
                          name={`question_${question.id}`}
                          value={userAnswers[question.id] || ''}
                          onChange={(e) => handleAnswerSelect(question.id, parseInt(e.target.value))}
                        >
                          {question.options.map((option, optIndex) => (
                            <FormControlLabel
                              key={optIndex}
                              value={optIndex}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                
                <Box textAlign="center">
                  <Button 
                    onClick={handleQuizSubmit}
                    variant="contained"
                    size="large"
                    disabled={!allQuestionsAnswered()}
                  >
                    Submit Answers
                  </Button>
                  {!allQuestionsAnswered() && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      Please answer all questions before submitting.
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {currentStep === 'results' && roadmap && (
              <Box ref={roadmapRef}>
                <Typography variant="h4" gutterBottom textAlign="center" color="primary">
                  Your Personalized Learning Roadmap for {topic}
                </Typography>
                
                <Card sx={{ mb: 4, backgroundColor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Score: {score} out of {quizData.length}
                    </Typography>
                    {weakConcepts.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Areas to focus on:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {weakConcepts.map((concept, index) => (
                            <Chip
                              key={index}
                              label={concept}
                              size="small"
                              sx={{ backgroundColor: 'white', color: 'primary.main' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                <Typography variant="h5" gutterBottom>
                  Your {roadmap.level} Level Roadmap ({roadmap.weeks} weeks)
                </Typography>
                
                <Timeline position="alternate">
                  {roadmap.steps.map((step, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                        Week {step.week}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={getTimelineColor(index)}>
                          {getTimelineIcon(index)}
                        </TimelineDot>
                        {index < roadmap.steps.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card sx={{ maxWidth: 500 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {step.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {step.description}
                            </Typography>
                            {step.concepts && step.concepts.length > 0 && (
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Key Concepts:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                  {step.concepts.map((concept, i) => (
                                    <Chip
                                      key={i}
                                      label={concept}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                            {step.milestone && (
                              <Box sx={{ mt: 2, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="white">
                                  Milestone: {step.milestone}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
                
                <Box textAlign="center" mt={4}>
                  <Button onClick={restartProcess} variant="outlined" sx={{ mr: 2 }}>
                    Create Another Roadmap
                  </Button>
                  <Button 
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadClick}
                  >
                    Download Roadmap
                  </Button>
                  
                  <Menu
                    anchorEl={downloadAnchorEl}
                    open={Boolean(downloadAnchorEl)}
                    onClose={handleDownloadClose}
                  >
                    <MenuItem onClick={downloadAsPDF}>
                      <ListItemIcon>
                        <PdfIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Download as PDF</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={downloadAsText}>
                      <ListItemIcon>
                        <TextIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Download as Text</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}

            {isLoading && (
              <Box textAlign="center" py={4}>
                <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Generating your personalized roadmap...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a few moments
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DishaGenRoadmap;