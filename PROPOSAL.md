# Patch

Authors: 
- Xavier Hertzog
- Fernando Martinez
- Caleb Johnson
- Kristopher Noel

Team Name: KFCX

## 😞 The Problem 

Medical misdiagnosis is a widespread and dangerous issue. In the U.S. alone, 12 million adults are misdiagnosed every year—that’s 1 in 20 patients in outpatient care. Globally, 16% of all preventable harm in healthcare is due to diagnostic errors. These mistakes often stem from gaps in communication during short clinical visits, where patients struggle to recall or clearly express their symptoms. This disconnect can lead to delayed care, incorrect treatment, or even permanent disability—impacting hundreds of thousands of lives annually.

## 📝 Summary

PATCH is a web platform that empowers users—especially those managing chronic conditions like diabetes—to track symptoms, medications, and health patterns in one centralized, user-friendly space. By helping users log their experiences in real time, PATCH turns vague recollections into organized, visual timelines that improve communication between patients and healthcare providers—reducing the likelihood of misdiagnosis and improving care outcomes.

## 🤔 Our Hypothesis

If users can easily track and share their health symptoms over time, then doctors will have better context to make accurate diagnoses, which will reduce misdiagnoses and improve patient outcomes, particularly for those with chronic conditions.

## 📱 Product Overview

PATCH allows users to:

Log daily symptoms, pain levels, medications, and insulin use

View a personal health timeline to identify patterns

Edit entries and track progress over time

Seamlessly share data with providers for clearer communication

Built with React on the frontend and Node.js/Express + PostgreSQL on the backend, PATCH is a full-stack solution for more informed and proactive healthcare.

## 🏙️  Mission Statement 

Our mission is to bridge the communication gap between patients and healthcare providers by helping users clearly track and communicate their health experiences—so they can be seen, heard, and accurately cared for.

## 🫂 Who do we serve?

PATCH is built for:

Individuals managing chronic conditions, such as diabetes, and who are experiencing symptoms

Patients preparing for doctor visits who need a way to track symptoms over time

Underserved communities who may experience disparities in diagnosis and need a tool to advocate for themselves

Caregivers and families supporting loved ones with complex health needs

## 🧳 User Journy Map

Sign Up: User creates an account and provides basic health info

Log Symptoms: User enters symptoms, pain level, location, and notes

Track Progress: User views logged entries in a timeline-style dashboard

Prepare for Care: User uses PATCH as a reference when visiting a doctor

Adjust Over Time: User edits or adds new entries as their health changes

## 👥 User-stories

As a patient with diabetes, I want to log my daily insulin levels so I can better understand patterns in my blood sugar.

As a user with frequent headaches, I want to track when and where my pain happens so I can describe it clearly to my doctor.

As a caregiver, I want to help log my family member’s symptoms so I can advocate for them in appointments.

As a provider, I want to view clear symptom histories so I can make more informed treatment decisions.

## 🧗‍♂️ Key Technical Challenge

A major challenge was designing and connecting a relational database schema that could track complex, interdependent data—such as symptoms, medications, and insulin logs—per user. Ensuring accurate foreign key relationships and syncing the backend with frontend forms required close collaboration, schema validation, and rigorous testing.

## 🏋🏽 Extension Opportunities 

Health Insights Dashboard: Visual trends, symptom analysis, and potential triggers

Appointment Prep Reports: Auto-generated summaries to bring to visits

Push Reminders: Prompt users to log symptoms or medications daily

Provider Access Portal: Optional view-only access for doctors

Multi-language Support: Serve a broader, more diverse user base

## 📒 Sources

ECRI Institute. Patient Safety Concerns 2024. home.ecri.org

PAHO. Diagnostic Safety. paho.org

Singh, H., et al. Frequency of diagnostic errors in outpatient care. BMJ Quality & Safety, 2014.
