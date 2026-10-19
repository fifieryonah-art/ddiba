import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import { apiFetch } from "../services/api";

export default function UploadMaterial() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [activeTab, setActiveTab] = useState("type");

  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Biology");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileMessage, setFileMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [lessonLoading, setLessonLoading] = useState(false);

  const [error, setError] = useState("");

  const [voiceSupported, setVoiceSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const [readAloudEnabled, setReadAloudEnabled] =
    useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const wordCount = useMemo(() => {
    if (!input.trim()) {
      return 0;
    }

    return input.trim().split(/\s+/).length;
  }, [input]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const profile = await apiFetch("/api/profile/");

        setReadAloudEnabled(
          Boolean(profile.read_aloud)
        );
      } catch (err) {
        console.error(
          "Could not load learner preferences:",
          err
        );
      }
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        transcript +=
          event.results[index][0].transcript;
      }

      setInput(transcript.trim());
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (event.error === "no-speech") {
        setError(
          "I did not hear anything. Please try speaking again."
        );
      } else {
        setError(
          "Voice recognition could not understand the microphone input."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Already stopped.
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (!voiceSupported) {
      setError(
        "Voice recognition is not supported by this browser. You can still type your question."
      );

      return;
    }

    if (!recognitionRef.current) {
      return;
    }

    setInput("");
    setError("");

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(
        "Could not start microphone:",
        err
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped.
      }
    }

    setIsListening(false);
  };

  const speakText = (message) => {
    if (!message) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      setError(
        "Text-to-speech is not supported by this browser."
      );

      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(message);

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  const pasteLatest = async () => {
    try {
      setError("");

      const clipboardText =
        await navigator.clipboard.readText();

      if (clipboardText) {
        setInput(clipboardText);
      }
    } catch {
      setError(
        "Clipboard permission was not available. You can paste manually with Ctrl+V."
      );
    }
  };

  const sendChatMessage = async () => {
    const message = input.trim();

    if (!message) {
      setError(
        "Please type, paste, upload, or say something first."
      );

      return;
    }

    try {
      setChatLoading(true);
      setError("");

      const history = chatMessages.map(
        (item) => ({
          role: item.role,
          content: item.content,
        })
      );

      const userMessage = {
        role: "user",
        content: message,
        type: "text",
        image: null,
      };

      setChatMessages(
        (current) => [
          ...current,
          userMessage,
        ]
      );

      setInput("");

      const data = await apiFetch(
        "/api/voice-chat/",
        {
          method: "POST",
          body: JSON.stringify({
            message,
            history,
          }),
        }
      );

      const assistantMessage = {
        role: "assistant",
        content:
          data.response ||
          "Here is the result.",
        type:
          data.type ||
          "text",
        image:
          data.image ||
          null,
      };

      setChatMessages(
        (current) => [
          ...current,
          assistantMessage,
        ]
      );

      const shouldRead =
        data.read_aloud ??
        readAloudEnabled;

      if (
        shouldRead &&
        assistantMessage.content
      ) {
        speakText(
          assistantMessage.content
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Ddiba could not respond right now."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingFile(true);
      setError("");
      setFileMessage("");
      setSelectedFile(file);

      const formData = new FormData();

      formData.append("file", file);

      const data = await apiFetch(
        "/api/extract-file/",
        {
          method: "POST",
          body: formData,
        }
      );

      setInput(
        data.extracted_text || ""
      );

      setFileMessage(
        `${data.filename} loaded successfully. ${data.character_count} characters extracted.`
      );
    } catch (err) {
      console.error(err);

      setSelectedFile(null);

      setError(
        err.message ||
          "Ddiba could not read this file."
      );
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAdaptLesson = async () => {
    const material = input.trim();

    if (!material) {
      setError(
        "Please type, paste, or upload learning material first."
      );

      return;
    }

    try {
      setLessonLoading(true);
      setError("");

      const profile = await apiFetch(
        "/api/profile/"
      );

      const data = await apiFetch(
        "/api/adapt-lesson/",
        {
          method: "POST",

          body: JSON.stringify({
            text: material,
            subject,

            preferences: {
              short_explanations:
                profile.short_explanations,

              step_by_step:
                profile.step_by_step,

              examples:
                profile.examples,

              larger_text:
                profile.larger_text,

              more_spacing:
                profile.more_spacing,

              shorter_paragraphs:
                profile.shorter_paragraphs,

              highlight_words:
                profile.highlight_words,

              read_aloud:
                profile.read_aloud,

              pace:
                profile.pace,
            },
          }),
        }
      );

      navigate("/lesson", {
  state: {
    originalText: material,

    simplifiedText:
      data.simplified_text,

    keyPoints:
      data.key_points,

    subject:
      data.subject ||
      subject,

    preferences:
      profile,

    materialId:
      data.material_id,
  },
});
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while adapting your lesson."
      );
    } finally {
      setLessonLoading(false);
    }
  };

  const clearInput = () => {
    setInput("");
    setSelectedFile(null);
    setFileMessage("");
    setError("");
  };

  const newConversation = () => {
    setChatMessages([]);
    setInput("");
    setError("");

    stopSpeaking();
  };

  const renderConversation = () => {
    if (chatMessages.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          width: "100%",
          marginTop: "18px",
          display: "grid",
          gap: "10px",
        }}
      >
        {chatMessages.map(
          (message, index) => (
            <div
              key={`${message.role}-${index}`}
              style={{
                padding: "13px 15px",
                borderRadius: "16px",

                background:
                  message.role === "user"
                    ? "#eeeaff"
                    : "#ffffff",

                textAlign: "left",

                boxShadow:
                  "0 2px 8px rgba(30,30,50,0.05)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "11px",
                  color: "#573cc5",
                }}
              >
                {message.role === "user"
                  ? "You"
                  : "Ddiba"}
              </strong>

              {message.content && (
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-line",
                    lineHeight: "1.6",
                  }}
                >
                  {message.content}
                </p>
              )}

              {message.image && (
                <div
                  style={{
                    width: "100%",
                    marginTop: "12px",
                  }}
                >
                  <img
                    src={message.image}
                    alt="Ddiba generated learning visual"
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: "520px",
                      height: "auto",
                      margin: "0 auto",
                      borderRadius: "18px",
                      border:
                        "1px solid #eceaf7",
                    }}
                  />
                </div>
              )}

              {message.role === "assistant" &&
                message.content && (
                  <button
                    type="button"
                    className="ddiba-speaking-stop-btn"
                    onClick={() =>
                      speakText(
                        message.content
                      )
                    }
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <Icon name="volume" />
                    Read this aloud
                  </button>
                )}
            </div>
          )
        )}
      </div>
    );
  };

  const renderSharedInput = (
    voiceMode = false
  ) => (
    <div
      style={{
        width: "100%",
        marginTop: "16px",
      }}
    >
      <textarea
        value={input}
        onChange={(event) =>
          setInput(
            event.target.value
          )
        }
        placeholder={
          isListening
            ? "Listening to you..."
            : voiceMode
            ? "Your speech will appear here. You can also type..."
            : "Type a question, paste your notes, or ask Ddiba to visualise something..."
        }
        style={{
          boxSizing: "border-box",
          width: "100%",
          minHeight: "95px",
          padding: "14px",
          border:
            "1px solid #dedee8",
          borderRadius: "14px",
          resize: "vertical",
          outline: "none",
          font: "inherit",
        }}
      />

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          justifyContent:
            "space-between",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <span className="word-count-pill">
          <Icon name="check" />
          {wordCount} words
        </span>

        <div
          style={{
            display: "flex",
            gap: "7px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="ddiba-paste-btn"
            onClick={pasteLatest}
          >
            ▣ Paste latest
          </button>

          {!voiceMode && (
            <button
              type="button"
              className="ddiba-paste-btn"
              onClick={() =>
                setActiveTab("voice")
              }
            >
              <Icon name="mic" />
              Talk
            </button>
          )}

          {input && (
            <button
              type="button"
              className="ddiba-paste-btn"
              onClick={clearInput}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className="ddiba-ask-btn"
        onClick={sendChatMessage}
        disabled={
          chatLoading ||
          !input.trim()
        }
      >
        {chatLoading
          ? "Ddiba is thinking..."
          : "Ask Ddiba →"}
      </button>
    </div>
  );

  return (
    <ResponsiveLayout
      className="upload-material-page"
    >
      <header className="upload-main-header">
        <div className="upload-brand">
          <LogoMark size={39} />

          <div className="upload-brand-copy">
            <small>Ddiba</small>
            <strong>Dashboard</strong>
          </div>
        </div>

        <div className="upload-header-actions">
          <span className="upload-streak-pill">
            <Icon name="sparkle" />
          </span>

          <div className="upload-avatar">
            L
          </div>
        </div>
      </header>

      <section className="upload-subheader">
        <button
          className="upload-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
          aria-label="Back"
        >
          <Icon name="arrowLeft" />
        </button>

        <h2>
          New Learning Topic
        </h2>

        <button
          className="upload-menu-btn"
          aria-label="More options"
        >
          <Icon name="list" />
        </button>
      </section>

      <span className="upload-reader-label">
        <Icon name="sparkle" />{" "}
        DDIBA INTELLIGENT READER
      </span>

      <section className="upload-heading">
        <h1>
          What are you learning
          <br />
          today?
        </h1>

        <p>
          Type, paste, upload, talk,
          or ask Ddiba to create a visual.
        </p>
      </section>

      <section className="upload-tabs">
        <button
          type="button"
          className={
            activeTab === "type"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("type")
          }
        >
          <Icon name="type" />
          Type / Paste
        </button>

        <button
          type="button"
          className={
            activeTab === "voice"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("voice")
          }
        >
          <Icon name="mic" />
          Talk to Ddiba
        </button>

        <button
          type="button"
          className={
            activeTab === "file"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("file")
          }
        >
          <Icon name="cloudUpload" />
          Upload File
        </button>
      </section>

      {activeTab === "type" && (
        <section className="upload-alternative-card">
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                }}
              >
                Ask Ddiba
              </h3>

              <p
                style={{
                  marginBottom: 0,
                }}
              >
                Ask a question, paste notes,
                or ask for a visual.
              </p>
            </div>

            {chatMessages.length > 0 && (
              <button
                type="button"
                onClick={
                  newConversation
                }
              >
                New chat
              </button>
            )}
          </div>

          {renderConversation()}

          {renderSharedInput(false)}

          <div
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "10px",
              boxSizing:
                "border-box",
              borderRadius: "12px",
              background: "#f7f7fb",
              fontSize: "11px",
              color: "#666879",
            }}
          >
            {readAloudEnabled
              ? "🔊 Read aloud is enabled. Ddiba will automatically speak its answers."
              : "🔇 Automatic read aloud is off. You can still play any Ddiba answer manually."}
          </div>
        </section>
      )}

      {activeTab === "voice" && (
        <section className="upload-alternative-card">
          <div className="alternative-icon">
            <Icon name="mic" />
          </div>

          <h3>
            Talk to Ddiba
          </h3>

          <p>
            Speak naturally. You can also ask
            Ddiba to visualise what you are learning.
          </p>

          {!voiceSupported && (
            <div
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                marginTop: "12px",
                padding: "12px",
                borderRadius: "12px",
                background: "#fff8e7",
                fontSize: "12px",
              }}
            >
              Your browser does not
              support speech recognition.
              You can still type below.
            </div>
          )}

          <div className="ddiba-voice-controls">
            {!isListening ? (
              <button
                type="button"
                className="ddiba-voice-start-btn"
                onClick={startListening}
                disabled={
                  chatLoading ||
                  !voiceSupported
                }
              >
                <span className="ddiba-voice-btn-icon">
                  <Icon name="mic" />
                </span>

                <span className="ddiba-voice-btn-copy">
                  <strong>
                    Start Talking
                  </strong>

                  <small>
                    Tap and speak naturally
                  </small>
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="ddiba-voice-stop-btn"
                onClick={stopListening}
              >
                <span className="ddiba-voice-stop-icon">
                  ■
                </span>

                <span className="ddiba-voice-btn-copy">
                  <strong>
                    Stop Listening
                  </strong>

                  <small>
                    Ddiba is listening to you
                  </small>
                </span>
              </button>
            )}

            {isSpeaking && (
              <button
                type="button"
                className="ddiba-speaking-stop-btn"
                onClick={stopSpeaking}
              >
                <Icon name="volume" />
                Stop Ddiba speaking
              </button>
            )}
          </div>

          {isListening && (
            <div className="ddiba-listening-indicator">
              <div className="ddiba-listening-waves">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div>
                <strong>
                  Listening...
                </strong>

                <small>
                  Speak clearly and Ddiba
                  will write it below.
                </small>
              </div>
            </div>
          )}

          {renderConversation()}

          {renderSharedInput(true)}

          {chatMessages.length > 0 && (
            <button
              type="button"
              onClick={
                newConversation
              }
              style={{
                marginTop: "12px",
              }}
            >
              Start new conversation
            </button>
          )}
        </section>
      )}

      {activeTab === "file" && (
        <section className="upload-alternative-card">
          <div className="alternative-icon">
            <Icon name="cloudUpload" />
          </div>

          <h3>
            Upload Learning Material
          </h3>

          <p>
            Upload a TXT, PDF, DOCX,
            or PPTX file. Ddiba will
            place the extracted content
            into the same learning box.
          </p>

          <button
            type="button"
            className="upload-file-label"
            disabled={uploadingFile}
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            {uploadingFile
              ? "Reading file..."
              : selectedFile
              ? "Choose another file"
              : "Choose File"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx,.pptx"
            onChange={
              handleFileUpload
            }
            style={{
              display: "none",
            }}
          />

          {selectedFile && (
            <div
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                marginTop: "14px",
                padding: "12px",
                borderRadius: "14px",
                background: "#f3f1ff",
              }}
            >
              <strong>
                {selectedFile.name}
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "12px",
                }}
              >
                {uploadingFile
                  ? "Ddiba is extracting the text..."
                  : fileMessage}
              </p>
            </div>
          )}

          {input &&
            !uploadingFile && (
              <button
                type="button"
                style={{
                  marginTop: "12px",
                }}
                onClick={() =>
                  setActiveTab("type")
                }
              >
                Continue with extracted text
                <Icon name="arrowRight" />
              </button>
            )}
        </section>
      )}

      {activeTab !== "voice" && (
        <section className="subject-framing">
          <p>
            Add quick subject framing:
          </p>

          <div className="subject-options">
            <button
              type="button"
              className={
                subject === "Biology"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSubject("Biology")
              }
            >
              <Icon name="dna" />
              Biology
            </button>

            <button
              type="button"
              className={
                subject === "History"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSubject("History")
              }
            >
              <Icon name="scroll" />
              History
            </button>

            <button
              type="button"
              className={
                subject === "Math"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSubject("Math")
              }
            >
              Σ Math
            </button>
          </div>
        </section>
      )}

      {error && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px",
            borderRadius: "14px",
            background: "#fff0f2",
            color: "#a2394a",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {activeTab !== "voice" &&
        input.trim() && (
          <button
            className="make-easier-btn"
            onClick={
              handleAdaptLesson
            }
            disabled={
              lessonLoading ||
              uploadingFile
            }
          >
            {lessonLoading ? (
              <>
                <Icon name="sparkle" />
                Ddiba is adapting your lesson...
              </>
            ) : (
              <>
                <Icon name="sparkle" />
                Make it easier
                <Icon name="arrowRight" />
              </>
            )}
          </button>
        )}

      <nav className="upload-bottom-nav">
        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span>
            <Icon name="book" />
          </span>
          <small>Learn</small>
        </button>

        <button
          onClick={() =>
            navigate("/practice")
          }
        >
          <span>
            <Icon name="play" />
          </span>
          <small>Practice</small>
        </button>

        <button
          className="active"
          onClick={() =>
            navigate("/upload")
          }
        >
          <span>
            <Icon name="file" />
          </span>
          <small>Notes</small>
        </button>

        <button
          onClick={() =>
            navigate("/progress")
          }
        >
          <span>
            <Icon name="chart" />
          </span>
          <small>Progress</small>
        </button>
      </nav>
    </ResponsiveLayout>
  );
}