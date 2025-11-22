package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.user.ProfessorDto;
import com.ClassCraft.site.dto.user.ProfessorRequestDto;
import com.ClassCraft.site.dto.user.StudentDto;
import com.ClassCraft.site.dto.user.StudentRequestDto;
import com.ClassCraft.site.models.Groupe;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.models.UserRole;
import com.ClassCraft.site.repository.GroupeRepository;
import com.ClassCraft.site.repository.UserRepository;
import com.ClassCraft.site.service.UserService;

@Service
public class UserServiceImpl extends AbstractCrudService<User, Long> implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GroupeRepository groupeRepository;

    public UserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder,
                          GroupeRepository groupeRepository) {
        super(repository);
        this.userRepository = repository;
        this.passwordEncoder = passwordEncoder;
        this.groupeRepository = groupeRepository;
    }

    // ========== Student Methods ==========

    @Override
    @Transactional(readOnly = true)
    public Page<StudentDto> findAllStudentsPaged(Pageable pageable) {
        Page<User> studentsPage = userRepository.findByRole(UserRole.STUDENT, pageable);
        List<StudentDto> students = studentsPage.getContent().stream()
                .map(user -> new StudentDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.isApproved(),
                        user.getGroupe() != null ? user.getGroupe().getId() : null
                ))
                .collect(Collectors.toList());
        return new PageImpl<>(students, pageable, studentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto findStudentById(Long id) {
        return findById(id)
                .filter(user -> user.getRole() == UserRole.STUDENT)
                .map(user -> new StudentDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.isApproved(),
                        user.getGroupe() != null ? user.getGroupe().getId() : null
                ))
                .orElse(null);
    }

    @Override
    @Transactional
    public StudentDto createStudent(StudentRequestDto requestDto) {
        User user = new User();
        user.setEmail(requestDto.email());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setFirstName(requestDto.firstName());
        user.setLastName(requestDto.lastName());
        user.setRole(UserRole.STUDENT);
        user.setApproved(requestDto.approved() != null ? requestDto.approved() : false);
        
        if (requestDto.groupeId() != null) {
            Groupe groupe = groupeRepository.findById(requestDto.groupeId())
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));
            user.setGroupe(groupe);
        }
        
        User savedStudent = save(user);
        return new StudentDto(
                savedStudent.getId(),
                savedStudent.getEmail(),
                savedStudent.getFirstName(),
                savedStudent.getLastName(),
                savedStudent.getRole(),
                savedStudent.isApproved(),
                savedStudent.getGroupe() != null ? savedStudent.getGroupe().getId() : null
        );
    }

    @Override
    @Transactional
    public StudentDto updateStudent(Long id, StudentRequestDto requestDto) {
        return findById(id)
                .filter(existingUser -> existingUser.getRole() == UserRole.STUDENT)
                .map(existingStudent -> {
                    existingStudent.setEmail(requestDto.email());
                    existingStudent.setFirstName(requestDto.firstName());
                    existingStudent.setLastName(requestDto.lastName());
                    if (requestDto.password() != null && !requestDto.password().isEmpty()) {
                        existingStudent.setPassword(passwordEncoder.encode(requestDto.password()));
                    }
                    existingStudent.setApproved(requestDto.approved() != null ? requestDto.approved() : existingStudent.isApproved());
                    
                    if (requestDto.groupeId() != null) {
                        Groupe groupe = groupeRepository.findById(requestDto.groupeId())
                                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
                        existingStudent.setGroupe(groupe);
                    } else {
                        existingStudent.setGroupe(null);
                    }
                    
                    User updatedStudent = save(existingStudent);
                    return new StudentDto(
                            updatedStudent.getId(),
                            updatedStudent.getEmail(),
                            updatedStudent.getFirstName(),
                            updatedStudent.getLastName(),
                            updatedStudent.getRole(),
                            updatedStudent.isApproved(),
                            updatedStudent.getGroupe() != null ? updatedStudent.getGroupe().getId() : null
                    );
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteStudent(Long id) {
        return findById(id)
                .filter(user -> user.getRole() == UserRole.STUDENT)
                .map(user -> {
                    deleteById(id);
                    return true;
                })
                .orElse(false);
    }

    // ========== Professor Methods ==========

    @Override
    @Transactional(readOnly = true)
    public Page<ProfessorDto> findAllProfessorsPaged(Pageable pageable) {
        Page<User> professorsPage = userRepository.findByRole(UserRole.PROFESSOR, pageable);
        List<ProfessorDto> professors = professorsPage.getContent().stream()
                .map(user -> new ProfessorDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.isApproved(),
                        user.getGroupe() != null ? user.getGroupe().getId() : null
                ))
                .collect(Collectors.toList());
        return new PageImpl<>(professors, pageable, professorsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorDto findProfessorById(Long id) {
        return findById(id)
                .filter(user -> user.getRole() == UserRole.PROFESSOR)
                .map(user -> new ProfessorDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.isApproved(),
                        user.getGroupe() != null ? user.getGroupe().getId() : null
                ))
                .orElse(null);
    }

    @Override
    @Transactional
    public ProfessorDto createProfessor(ProfessorRequestDto requestDto) {
        User user = new User();
        user.setEmail(requestDto.email());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setFirstName(requestDto.firstName());
        user.setLastName(requestDto.lastName());
        user.setRole(UserRole.PROFESSOR);
        user.setApproved(requestDto.approved() != null ? requestDto.approved() : false);
        
        if (requestDto.groupeId() != null) {
            Groupe groupe = groupeRepository.findById(requestDto.groupeId())
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));
            user.setGroupe(groupe);
        }
        
        User savedProfessor = save(user);
        return new ProfessorDto(
                savedProfessor.getId(),
                savedProfessor.getEmail(),
                savedProfessor.getFirstName(),
                savedProfessor.getLastName(),
                savedProfessor.getRole(),
                savedProfessor.isApproved(),
                savedProfessor.getGroupe() != null ? savedProfessor.getGroupe().getId() : null
        );
    }

    @Override
    @Transactional
    public ProfessorDto updateProfessor(Long id, ProfessorRequestDto requestDto) {
        return findById(id)
                .filter(existingUser -> existingUser.getRole() == UserRole.PROFESSOR)
                .map(existingProfessor -> {
                    existingProfessor.setEmail(requestDto.email());
                    existingProfessor.setFirstName(requestDto.firstName());
                    existingProfessor.setLastName(requestDto.lastName());
                    if (requestDto.password() != null && !requestDto.password().isEmpty()) {
                        existingProfessor.setPassword(passwordEncoder.encode(requestDto.password()));
                    }
                    existingProfessor.setApproved(requestDto.approved() != null ? requestDto.approved() : existingProfessor.isApproved());
                    
                    if (requestDto.groupeId() != null) {
                        Groupe groupe = groupeRepository.findById(requestDto.groupeId())
                                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
                        existingProfessor.setGroupe(groupe);
                    } else {
                        existingProfessor.setGroupe(null);
                    }
                    
                    User updatedProfessor = save(existingProfessor);
                    return new ProfessorDto(
                            updatedProfessor.getId(),
                            updatedProfessor.getEmail(),
                            updatedProfessor.getFirstName(),
                            updatedProfessor.getLastName(),
                            updatedProfessor.getRole(),
                            updatedProfessor.isApproved(),
                            updatedProfessor.getGroupe() != null ? updatedProfessor.getGroupe().getId() : null
                    );
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteProfessor(Long id) {
        return findById(id)
                .filter(user -> user.getRole() == UserRole.PROFESSOR)
                .map(user -> {
                    deleteById(id);
                    return true;
                })
                .orElse(false);
    }
}

