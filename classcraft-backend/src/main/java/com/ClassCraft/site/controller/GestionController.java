package com.ClassCraft.site.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.dto.groupe.GroupeDto;
import com.ClassCraft.site.dto.groupe.GroupeRequestDto;
import com.ClassCraft.site.dto.major.MajorDto;
import com.ClassCraft.site.dto.major.MajorRequestDto;
import com.ClassCraft.site.dto.module.ModuleDto;
import com.ClassCraft.site.dto.module.ModuleRequestDto;
import com.ClassCraft.site.dto.salle.SalleDto;
import com.ClassCraft.site.dto.salle.SalleRequestDto;
import com.ClassCraft.site.dto.section.SectionDto;
import com.ClassCraft.site.dto.section.SectionRequestDto;
import com.ClassCraft.site.dto.session.SessionDto;
import com.ClassCraft.site.dto.session.SessionRequestDto;
import com.ClassCraft.site.dto.sousmodule.SousModuleDto;
import com.ClassCraft.site.dto.sousmodule.SousModuleRequestDto;
import com.ClassCraft.site.dto.user.ProfessorDto;
import com.ClassCraft.site.dto.user.ProfessorRequestDto;
import com.ClassCraft.site.dto.user.StudentDto;
import com.ClassCraft.site.dto.user.StudentRequestDto;
import com.ClassCraft.site.service.GroupeService;
import com.ClassCraft.site.service.MajorService;
import com.ClassCraft.site.service.ModuleService;
import com.ClassCraft.site.service.SalleService;
import com.ClassCraft.site.service.SectionService;
import com.ClassCraft.site.service.SessionService;
import com.ClassCraft.site.service.SousModuleService;
import com.ClassCraft.site.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/gestion")
@Tag(name = "Gestion", description = "API endpoints for managing classrooms, modules, students, professors, majors, groups, sections, sessions, and submodules")
public class GestionController {

    private final SalleService salleService;
    private final ModuleService moduleService;
    private final UserService userService;
    private final MajorService majorService;
    private final GroupeService groupeService;
    private final SectionService sectionService;
    private final SessionService sessionService;
    private final SousModuleService sousModuleService;

    public GestionController(SalleService salleService, ModuleService moduleService, 
                             UserService userService, MajorService majorService,
                             GroupeService groupeService, SectionService sectionService,
                             SessionService sessionService, SousModuleService sousModuleService) {
        this.salleService = salleService;
        this.moduleService = moduleService;
        this.userService = userService;
        this.majorService = majorService;
        this.groupeService = groupeService;
        this.sectionService = sectionService;
        this.sessionService = sessionService;
        this.sousModuleService = sousModuleService;
    }

    // ========== Salle CRUD ==========
    
    @Operation(summary = "Get all classrooms", description = "Retrieve a paginated list of all classrooms")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of classrooms",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SalleDto.class)))
    })
    @GetMapping("/classrooms")
    public ResponseEntity<Page<SalleDto>> getAllSalles(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<SalleDto> salles = salleService.findAllPaged(pageable);
        return ResponseEntity.ok(salles);
    }

    @Operation(summary = "Get classroom by ID", description = "Retrieve a specific classroom by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Classroom found",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SalleDto.class))),
        @ApiResponse(responseCode = "404", description = "Classroom not found")
    })
    @GetMapping("/classrooms/{id}")
    public ResponseEntity<SalleDto> getSalleById(
            @Parameter(description = "Classroom ID") @PathVariable Long id) {
        SalleDto salleDto = salleService.findByIdAsDto(id);
        if (salleDto != null) {
            return ResponseEntity.ok(salleDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new classroom", description = "Create a new classroom with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Classroom created successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SalleDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/classrooms")
    public ResponseEntity<SalleDto> createSalle(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Classroom details") 
            @Valid @RequestBody SalleRequestDto requestDto) {
        SalleDto salleDto = salleService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salleDto);
    }

    @Operation(summary = "Update a classroom", description = "Update an existing classroom by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Classroom updated successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SalleDto.class))),
        @ApiResponse(responseCode = "404", description = "Classroom not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/classrooms/{id}")
    public ResponseEntity<SalleDto> updateSalle(
            @Parameter(description = "Classroom ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated classroom details")
            @Valid @RequestBody SalleRequestDto requestDto) {
        SalleDto salleDto = salleService.update(id, requestDto);
        if (salleDto != null) {
            return ResponseEntity.ok(salleDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a classroom", description = "Delete a classroom by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Classroom deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Classroom not found")
    })
    @DeleteMapping("/classrooms/{id}")
    public ResponseEntity<Void> deleteSalle(
            @Parameter(description = "Classroom ID") @PathVariable Long id) {
        if (salleService.findById(id).isPresent()) {
            salleService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Module CRUD ==========
    
    @Operation(summary = "Get all modules", description = "Retrieve a paginated list of all modules")
    @GetMapping("/modules")
    public ResponseEntity<Page<ModuleDto>> getAllModules(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<ModuleDto> modules = moduleService.findAllPaged(pageable);
        return ResponseEntity.ok(modules);
    }

    @Operation(summary = "Get module by ID", description = "Retrieve a specific module by its ID")
    @GetMapping("/modules/{id}")
    public ResponseEntity<ModuleDto> getModuleById(
            @Parameter(description = "Module ID") @PathVariable Long id) {
        ModuleDto moduleDto = moduleService.findByIdAsDto(id);
        if (moduleDto != null) {
            return ResponseEntity.ok(moduleDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new module", description = "Create a new module with the provided details")
    @PostMapping("/modules")
    public ResponseEntity<ModuleDto> createModule(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Module details")
            @Valid @RequestBody ModuleRequestDto requestDto) {
        ModuleDto moduleDto = moduleService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(moduleDto);
    }

    @Operation(summary = "Update a module", description = "Update an existing module by its ID")
    @PutMapping("/modules/{id}")
    public ResponseEntity<ModuleDto> updateModule(
            @Parameter(description = "Module ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated module details")
            @Valid @RequestBody ModuleRequestDto requestDto) {
        ModuleDto moduleDto = moduleService.update(id, requestDto);
        if (moduleDto != null) {
            return ResponseEntity.ok(moduleDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a module", description = "Delete a module by its ID")
    @DeleteMapping("/modules/{id}")
    public ResponseEntity<Void> deleteModule(
            @Parameter(description = "Module ID") @PathVariable Long id) {
        if (moduleService.findById(id).isPresent()) {
            moduleService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Student CRUD ==========
    
    @Operation(summary = "Get all students", description = "Retrieve a paginated list of all students")
    @GetMapping("/students")
    public ResponseEntity<Page<StudentDto>> getAllStudents(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<StudentDto> students = userService.findAllStudentsPaged(pageable);
        return ResponseEntity.ok(students);
    }

    @Operation(summary = "Get student by ID", description = "Retrieve a specific student by their ID")
    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(
            @Parameter(description = "Student ID") @PathVariable Long id) {
        StudentDto studentDto = userService.findStudentById(id);
        if (studentDto != null) {
            return ResponseEntity.ok(studentDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new student", description = "Create a new student account with the provided details")
    @PostMapping("/students")
    public ResponseEntity<StudentDto> createStudent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Student details")
            @Valid @RequestBody StudentRequestDto requestDto) {
        StudentDto studentDto = userService.createStudent(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(studentDto);
    }

    @Operation(summary = "Update a student", description = "Update an existing student by their ID")
    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDto> updateStudent(
            @Parameter(description = "Student ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated student details")
            @Valid @RequestBody StudentRequestDto requestDto) {
        StudentDto studentDto = userService.updateStudent(id, requestDto);
        if (studentDto != null) {
            return ResponseEntity.ok(studentDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a student", description = "Delete a student by their ID")
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(
            @Parameter(description = "Student ID") @PathVariable Long id) {
        if (userService.deleteStudent(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Professor CRUD ==========
    
    @Operation(summary = "Get all professors", description = "Retrieve a paginated list of all professors")
    @GetMapping("/professors")
    public ResponseEntity<Page<ProfessorDto>> getAllProfessors(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<ProfessorDto> professors = userService.findAllProfessorsPaged(pageable);
        return ResponseEntity.ok(professors);
    }

    @Operation(summary = "Get professor by ID", description = "Retrieve a specific professor by their ID")
    @GetMapping("/professors/{id}")
    public ResponseEntity<ProfessorDto> getProfessorById(
            @Parameter(description = "Professor ID") @PathVariable Long id) {
        ProfessorDto professorDto = userService.findProfessorById(id);
        if (professorDto != null) {
            return ResponseEntity.ok(professorDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new professor", description = "Create a new professor account with the provided details")
    @PostMapping("/professors")
    public ResponseEntity<ProfessorDto> createProfessor(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Professor details")
            @Valid @RequestBody ProfessorRequestDto requestDto) {
        ProfessorDto professorDto = userService.createProfessor(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(professorDto);
    }

    @Operation(summary = "Update a professor", description = "Update an existing professor by their ID")
    @PutMapping("/professors/{id}")
    public ResponseEntity<ProfessorDto> updateProfessor(
            @Parameter(description = "Professor ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated professor details")
            @Valid @RequestBody ProfessorRequestDto requestDto) {
        ProfessorDto professorDto = userService.updateProfessor(id, requestDto);
        if (professorDto != null) {
            return ResponseEntity.ok(professorDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a professor", description = "Delete a professor by their ID")
    @DeleteMapping("/professors/{id}")
    public ResponseEntity<Void> deleteProfessor(
            @Parameter(description = "Professor ID") @PathVariable Long id) {
        if (userService.deleteProfessor(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Major CRUD ==========
    
    @Operation(summary = "Get all majors", description = "Retrieve a paginated list of all majors")
    @GetMapping("/major")
    public ResponseEntity<Page<MajorDto>> getAllMajors(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<MajorDto> majors = majorService.findAllPaged(pageable);
        return ResponseEntity.ok(majors);
    }

    @Operation(summary = "Get major by ID", description = "Retrieve a specific major by its ID")
    @GetMapping("/major/{id}")
    public ResponseEntity<MajorDto> getMajorById(
            @Parameter(description = "Major ID") @PathVariable Long id) {
        MajorDto majorDto = majorService.findByIdAsDto(id);
        if (majorDto != null) {
            return ResponseEntity.ok(majorDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new major", description = "Create a new major with the provided details")
    @PostMapping("/major")
    public ResponseEntity<MajorDto> createMajor(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Major details")
            @Valid @RequestBody MajorRequestDto requestDto) {
        MajorDto majorDto = majorService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(majorDto);
    }

    @Operation(summary = "Update a major", description = "Update an existing major by its ID")
    @PutMapping("/major/{id}")
    public ResponseEntity<MajorDto> updateMajor(
            @Parameter(description = "Major ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated major details")
            @Valid @RequestBody MajorRequestDto requestDto) {
        MajorDto majorDto = majorService.update(id, requestDto);
        if (majorDto != null) {
            return ResponseEntity.ok(majorDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a major", description = "Delete a major by its ID")
    @DeleteMapping("/major/{id}")
    public ResponseEntity<Void> deleteMajor(
            @Parameter(description = "Major ID") @PathVariable Long id) {
        if (majorService.findById(id).isPresent()) {
            majorService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Groupe CRUD ==========
    
    @Operation(summary = "Get all groups", description = "Retrieve a paginated list of all groups")
    @GetMapping("/groups")
    public ResponseEntity<Page<GroupeDto>> getAllGroupes(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<GroupeDto> groupes = groupeService.findAllPaged(pageable);
        return ResponseEntity.ok(groupes);
    }

    @Operation(summary = "Get group by ID", description = "Retrieve a specific group by its ID")
    @GetMapping("/groups/{id}")
    public ResponseEntity<GroupeDto> getGroupeById(
            @Parameter(description = "Group ID") @PathVariable Long id) {
        GroupeDto groupeDto = groupeService.findByIdAsDto(id);
        if (groupeDto != null) {
            return ResponseEntity.ok(groupeDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new group", description = "Create a new group with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Group created successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = GroupeDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/groups")
    public ResponseEntity<GroupeDto> createGroupe(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Group details")
            @Valid @RequestBody GroupeRequestDto requestDto) {
        GroupeDto groupeDto = groupeService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(groupeDto);
    }

    @Operation(summary = "Update a group", description = "Update an existing group by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Group updated successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = GroupeDto.class))),
        @ApiResponse(responseCode = "404", description = "Group not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/groups/{id}")
    public ResponseEntity<GroupeDto> updateGroupe(
            @Parameter(description = "Group ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated group details")
            @Valid @RequestBody GroupeRequestDto requestDto) {
        GroupeDto groupeDto = groupeService.update(id, requestDto);
        if (groupeDto != null) {
            return ResponseEntity.ok(groupeDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a group", description = "Delete a group by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Group deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroupe(
            @Parameter(description = "Group ID") @PathVariable Long id) {
        if (groupeService.findById(id).isPresent()) {
            groupeService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Section CRUD ==========
    
    @Operation(summary = "Get all sections", description = "Retrieve a paginated list of all sections")
    @GetMapping("/sections")
    public ResponseEntity<Page<SectionDto>> getAllSections(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<SectionDto> sections = sectionService.findAllPaged(pageable);
        return ResponseEntity.ok(sections);
    }

    @Operation(summary = "Get section by ID", description = "Retrieve a specific section by its ID")
    @GetMapping("/sections/{id}")
    public ResponseEntity<SectionDto> getSectionById(
            @Parameter(description = "Section ID") @PathVariable Long id) {
        SectionDto sectionDto = sectionService.findByIdAsDto(id);
        if (sectionDto != null) {
            return ResponseEntity.ok(sectionDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new section", description = "Create a new section with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Section created successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SectionDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/sections")
    public ResponseEntity<SectionDto> createSection(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Section details")
            @Valid @RequestBody SectionRequestDto requestDto) {
        SectionDto sectionDto = sectionService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(sectionDto);
    }

    @Operation(summary = "Update a section", description = "Update an existing section by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Section updated successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SectionDto.class))),
        @ApiResponse(responseCode = "404", description = "Section not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/sections/{id}")
    public ResponseEntity<SectionDto> updateSection(
            @Parameter(description = "Section ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated section details")
            @Valid @RequestBody SectionRequestDto requestDto) {
        SectionDto sectionDto = sectionService.update(id, requestDto);
        if (sectionDto != null) {
            return ResponseEntity.ok(sectionDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a section", description = "Delete a section by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Section deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Section not found")
    })
    @DeleteMapping("/sections/{id}")
    public ResponseEntity<Void> deleteSection(
            @Parameter(description = "Section ID") @PathVariable Long id) {
        if (sectionService.findById(id).isPresent()) {
            sectionService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Session CRUD ==========
    
    @Operation(summary = "Get all sessions", description = "Retrieve a paginated list of all sessions")
    @GetMapping("/sessions")
    public ResponseEntity<Page<SessionDto>> getAllSessions(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<SessionDto> sessions = sessionService.findAllPaged(pageable);
        return ResponseEntity.ok(sessions);
    }

    @Operation(summary = "Get session by ID", description = "Retrieve a specific session by its ID")
    @GetMapping("/sessions/{id}")
    public ResponseEntity<SessionDto> getSessionById(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        SessionDto sessionDto = sessionService.findByIdAsDto(id);
        if (sessionDto != null) {
            return ResponseEntity.ok(sessionDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new session", description = "Create a new session with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Session created successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SessionDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/sessions")
    public ResponseEntity<SessionDto> createSession(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Session details")
            @Valid @RequestBody SessionRequestDto requestDto) {
        SessionDto sessionDto = sessionService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionDto);
    }

    @Operation(summary = "Update a session", description = "Update an existing session by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Session updated successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SessionDto.class))),
        @ApiResponse(responseCode = "404", description = "Session not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/sessions/{id}")
    public ResponseEntity<SessionDto> updateSession(
            @Parameter(description = "Session ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated session details")
            @Valid @RequestBody SessionRequestDto requestDto) {
        SessionDto sessionDto = sessionService.update(id, requestDto);
        if (sessionDto != null) {
            return ResponseEntity.ok(sessionDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a session", description = "Delete a session by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Session deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Session not found")
    })
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<Void> deleteSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        if (sessionService.findById(id).isPresent()) {
            sessionService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== SubModule CRUD ==========
    
    @Operation(summary = "Get all submodules", description = "Retrieve a paginated list of all submodules")
    @GetMapping("/submodules")
    public ResponseEntity<Page<SousModuleDto>> getAllSubModules(
            @Parameter(description = "Pagination parameters") @PageableDefault(size = 10) Pageable pageable) {
        Page<SousModuleDto> subModules = sousModuleService.findAllPaged(pageable);
        return ResponseEntity.ok(subModules);
    }

    @Operation(summary = "Get submodule by ID", description = "Retrieve a specific submodule by its ID")
    @GetMapping("/submodules/{id}")
    public ResponseEntity<SousModuleDto> getSubModuleById(
            @Parameter(description = "SubModule ID") @PathVariable Long id) {
        SousModuleDto sousModuleDto = sousModuleService.findByIdAsDto(id);
        if (sousModuleDto != null) {
            return ResponseEntity.ok(sousModuleDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new submodule", description = "Create a new submodule with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "SubModule created successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SousModuleDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/submodules")
    public ResponseEntity<SousModuleDto> createSubModule(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "SubModule details")
            @Valid @RequestBody SousModuleRequestDto requestDto) {
        SousModuleDto sousModuleDto = sousModuleService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(sousModuleDto);
    }

    @Operation(summary = "Update a submodule", description = "Update an existing submodule by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "SubModule updated successfully",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = SousModuleDto.class))),
        @ApiResponse(responseCode = "404", description = "SubModule not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/submodules/{id}")
    public ResponseEntity<SousModuleDto> updateSubModule(
            @Parameter(description = "SubModule ID") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated submodule details")
            @Valid @RequestBody SousModuleRequestDto requestDto) {
        SousModuleDto sousModuleDto = sousModuleService.update(id, requestDto);
        if (sousModuleDto != null) {
            return ResponseEntity.ok(sousModuleDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a submodule", description = "Delete a submodule by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "SubModule deleted successfully"),
        @ApiResponse(responseCode = "404", description = "SubModule not found")
    })
    @DeleteMapping("/submodules/{id}")
    public ResponseEntity<Void> deleteSubModule(
            @Parameter(description = "SubModule ID") @PathVariable Long id) {
        if (sousModuleService.findById(id).isPresent()) {
            sousModuleService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

